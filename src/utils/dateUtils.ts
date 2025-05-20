// src/utils/dateUtils.ts
import moment from "moment";
import { Sighting, WeeklySightings, DailySighting } from "@/types/ufo";

export const getDayName = (date: Date | string): string => {
  return moment(date).format("ddd"); // e.g., Mon, Tue
};

export const getWeekNumber = (date: Date | string): number => {
  return moment(date).isoWeek();
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = moment(startDate).format("MMM D");
  const end = moment(endDate).format("MMM D, YYYY"); // Added YYYY for clarity
  return `${start} - ${end}`;
};

export const groupSightingsByWeek = (rawSightings: Sighting[]): WeeklySightings[] => {
  if (!rawSightings || rawSightings.length === 0) {
    return [];
  }

  // 1. Aggregate sightings by date (YYYY-MM-DD format for Map key)
  //    and parse dates to moment objects. This handles potential duplicate date entries from API.
  const sightingsMap = new Map<string, { date: moment.Moment; sightings: number }>();
  rawSightings.forEach(s => {
    const mDate = moment(s.date, "DD/MM/YYYY", true); // true for strict parsing
    if (!mDate.isValid()) {
      console.warn(`Invalid date format skipped: ${s.date}`);
      return; 
    }
    const dateKey = mDate.format("YYYY-MM-DD");
    const existing = sightingsMap.get(dateKey);
    if (existing) {
      existing.sightings += s.sightings;
    } else {
      sightingsMap.set(dateKey, { date: mDate, sightings: s.sightings });
    }
  });

  // 2. Sort the aggregated sightings by date
  const sortedAggregatedSightings = Array.from(sightingsMap.values()).sort(
    (a, b) => a.date.valueOf() - b.date.valueOf()
  );

  if (sortedAggregatedSightings.length === 0) {
    return [];
  }

  const weeklyData: WeeklySightings[] = [];
  let currentWeekData: WeeklySightings | null = null;

  for (const { date: sightingMomentDate, sightings } of sortedAggregatedSightings) {
    const weekStartDateMoment = moment(sightingMomentDate).startOf('isoWeek'); // Monday

    // Check if this sighting belongs to a new week
    if (!currentWeekData || !moment(currentWeekData.startDate).isSame(weekStartDateMoment, 'day')) {
      // Initialize a new week
      const weekEndDateMoment = moment(weekStartDateMoment).endOf('isoWeek'); // Sunday
      const dailySightingsForNewWeek: DailySighting[] = [];
      for (let i = 0; i < 7; i++) {
        const dayInWeekMoment = moment(weekStartDateMoment).add(i, 'days');
        dailySightingsForNewWeek.push({
          date: dayInWeekMoment.toDate(),
          sightings: 0,
        });
      }
      currentWeekData = {
        startDate: weekStartDateMoment.toDate(),
        endDate: weekEndDateMoment.toDate(),
        dailySightings: dailySightingsForNewWeek,
      };
      weeklyData.push(currentWeekData);
    }

    // Add sighting to the correct day in the currentWeekData
    // moment().isoWeekday() is 1 for Monday, 7 for Sunday
    const dayIndex = sightingMomentDate.isoWeekday() - 1; 
    if (currentWeekData && currentWeekData.dailySightings[dayIndex]) {
        // Ensure the date slot matches the actual sighting date before adding
        if (moment(currentWeekData.dailySightings[dayIndex].date).isSame(sightingMomentDate, 'day')) {
            currentWeekData.dailySightings[dayIndex].sightings += sightings;
        } else {
            // This should ideally not happen if week init and dayIndex logic is correct
            console.warn("Date mismatch during week grouping. Sighting date:", sightingMomentDate.format("YYYY-MM-DD"), "Slot date:", moment(currentWeekData.dailySightings[dayIndex].date).format("YYYY-MM-DD"));
        }
    }
  }
  
  // Ensure weeklyData is sorted by start date (should be by construction, but good practice)
  weeklyData.sort((a, b) => moment(a.startDate).valueOf() - moment(b.startDate).valueOf());

  return weeklyData;
};