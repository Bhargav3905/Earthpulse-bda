import { Earthquake } from "../models/earthquake.model.js";

export async function getDashboardAnalytics(req, res, next) {
  try {
    const [summary, magnitude, daily, strongest] = await Promise.all([
      Earthquake.aggregate([
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            averageMagnitude: { $avg: "$magnitude" },
            maxMagnitude: { $max: "$magnitude" },
            tsunamiEvents: {
              $sum: { $cond: ["$tsunami", 1, 0] },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),

      Earthquake.aggregate([
        { $match: { magnitude: { $ne: null } } },
        {
          $bucket: {
            groupBy: "$magnitude",
            boundaries: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10],
            default: "10+",
            output: { count: { $sum: 1 } },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Earthquake.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$time",
              },
            },
            count: { $sum: 1 },
            averageMagnitude: { $avg: "$magnitude" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Earthquake.find(
        { magnitude: { $ne: null } },
        {
          usgsId: 1,
          magnitude: 1,
          place: 1,
          time: 1,
          depth: 1,
          latitude: 1,
          longitude: 1,
          eventUrl: 1,
        },
      )
        .sort({ magnitude: -1 })
        .limit(10)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        summary: summary[0] ?? {
          totalEvents: 0,
          averageMagnitude: null,
          maxMagnitude: null,
          tsunamiEvents: 0,
        },
        magnitudeDistribution: magnitude,
        dailyTrends: daily,
        strongestEvents: strongest,
      },
    });
  } catch (error) {
    next(error);
  }
}
