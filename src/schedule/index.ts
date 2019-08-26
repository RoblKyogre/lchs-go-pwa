// Original Author: Kai Bredemann
// Editor: Kevin Mo
// Copyright (c) iTeam 2019

import { MDY_Date } from './mdy_date'; 
import { Day, Schedule, Period } from './enums'; 
import { NoSchoolSchedule, RegularSchedule, BlockOddSchedule, BlockEvenSchedule, SpecialBlockOddSchedule, SpecialBlockEvenSchedule, 
        AssemblySchedule, RegularSchedule78, BlockOddSchedule78, BlockEvenSchedule78, HSBlockOddScheduleFor78, 
        HSBlockEvenScheduleFor78, HSSpecialBlockOddScheduleFor78, HSSpecialBlockEvenScheduleFor78, 
        AssemblySchedule7, AssemblySchedule8, EarlyReleaseSchedule78, MinimumSchedule, PreFinals3264Schedule, PreFinals2156Schedule, 
        PreFinals1345Schedule, FinalAssemblySchedule78, FinalAssemblySchedule12, Finals34Schedule, Finals15Schedule, 
        Finals26Schedule, FinalsTBDSchedule, SummerSchoolSchedule } from './schedules'; 

export const plus_days = 0; 

export const allGrades = [7, 8, 9, 10, 11, 12]; 

// Native Javascript
export function getCurrentDate(): any {
  const now = new Date();
  return {
    hrs: now.getHours(),
    mins: now.getMinutes(),
    total_mins: now.getMinutes() + (now.getHours() * 60),
    day: now.getDay(),
  };
} 

const summer_break: any[] = []; 

const breaks: any[] = []; 

const summer_school: [MDY_Date, MDY_Date] = [new MDY_Date(6, 17, 2019), new MDY_Date(7, 19, 2019)]; 

export const school_special_dates: any = {
  '8 - 21 - 2019': Schedule.REGULAR, 
  '8 - 22 - 2019': Schedule.REGULAR, 
  '8 - 23 - 2019': Schedule.ASSEMBLY, 
  '9 - 2 - 2019': Schedule.NONE,
  '10 - 25 - 2019': Schedule.NONE,
  '10 - 26 - 2019': Schedule.NONE,
  '10 - 27 - 2019': Schedule.NONE,
  '10 - 28 - 2019': Schedule.NONE,
  '10 - 29 - 2019': Schedule.NONE,
  '12 - 17 - 2019': Schedule.FINALS_TBD,
  '12 - 18 - 2019': Schedule.FINALS_TBD,
  '12 - 19 - 2019': Schedule.FINALS_TBD,
  '12 - 20 - 2019': Schedule.NONE,
  '12 - 23 - 2019': Schedule.NONE,
  '12 - 24 - 2019': Schedule.NONE,
  '12 - 25 - 2019': Schedule.NONE,
  '12 - 26 - 2019': Schedule.NONE,
  '12 - 27 - 2019': Schedule.NONE,
  '12 - 30 - 2019': Schedule.NONE,
  '12 - 31 - 2019': Schedule.NONE,
  '1 - 1 - 2019': Schedule.NONE,
  '1 - 2 - 2019': Schedule.NONE,
  '1 - 3 - 2019': Schedule.NONE,
  '1 - 6 - 2019': Schedule.NONE,
  
  // month - day - year: schedule (something from the Schedule enum) 
}; 

export const ms_special_dates: any = {
}; 

export const hs_special_dates: any = {
}; 

export const grade_special_dates: any = {
  7: {
  }, 
  8: {
  }, 
  9: {
  }, 
  10: {
  }, 
  11: {
  }, 
  12: {
  }, 
}; 

export function getScheduleFromDay(month: number, day: number, year: number, week_day: number, grade: number): Schedule {
  let shed = Schedule.NONE; 
  const high_schooler = 9 <= grade && grade <= 12; 
  const date = `${month} - ${day} - ${year}`; 
  const date_obj = new MDY_Date(month, day, year); 
  const own_grade_dates = grade_special_dates[grade]; 
  const own_section_dates = high_schooler ? hs_special_dates : ms_special_dates; 
  
  if(date in own_grade_dates) {
    shed = own_grade_dates[date]; 
  } else if(date in own_section_dates) {
    shed = own_section_dates[date]; 
  } else if(date in school_special_dates) {
    shed = school_special_dates[date]; 
  } else {
    // check to see if this date falls in a multi-date exception
    const is_summer_school = date_obj.between(...summer_school); 

    if(is_summer_school) {
      switch(week_day) {
        case Day.SUNDAY: 
        case Day.SATURDAY: 
          shed = Schedule.NONE; 
          break;
        case Day.MONDAY: 
        case Day.TUESDAY: 
        case Day.WEDNESDAY: 
        case Day.THURSDAY: 
        case Day.FRIDAY: 
          shed = Schedule.SUMMER_SCHOOL; 
          break; 
      } 
    } else {
      let not_break = true; 

      for(const brk of breaks) {
        const [start, end] = brk; 
        
        //console.log(date_obj.between(start, end)); 

        if(date_obj.between(start, end)) {
          shed = Schedule.NONE; 
          not_break = false; 

          break; 
        } 
      }

      if(not_break) {
        switch(week_day) {
          case Day.SUNDAY: 
          case Day.SATURDAY: 
            shed = Schedule.NONE; 
            break;
          case Day.MONDAY: 
          case Day.TUESDAY: 
          case Day.FRIDAY: 
            shed = Schedule.REGULAR;
            break;
          case Day.WEDNESDAY:
            shed = Schedule.BLOCK_ODD;
            break;
          case Day.THURSDAY:
            shed = Schedule.BLOCK_EVEN;
            break; 
        } 
      } 
    } 
  } 

  return shed;
}

export function toTime(hr: number, min: number) {
  return (hr * 60) + min;
}

export function getFullSchedule(schedule: Schedule, grade: number): any {
  const high_schooler = 9 <= grade && grade <= 12; 
  
  // TODO: Add more schedules
  switch(schedule) {
    case Schedule.NONE: 
      return NoSchoolSchedule; 
      break; 
    case Schedule.REGULAR: 
      return high_schooler ? RegularSchedule : RegularSchedule78; 
      break; 
    case Schedule.BLOCK_ODD: 
      return high_schooler ? BlockOddSchedule : BlockOddSchedule78; 
      break; 
    case Schedule.BLOCK_EVEN: 
      return high_schooler ? BlockEvenSchedule : BlockEvenSchedule78; 
      break; 
    case Schedule.SBAC_BLOCK_ODD: 
      return high_schooler ? BlockOddSchedule : HSBlockOddScheduleFor78; 
      break; 
    case Schedule.SBAC_BLOCK_EVEN: 
      return high_schooler ? BlockEvenSchedule : HSBlockEvenScheduleFor78; 
      break; 
    case Schedule.SBAC_SPECIAL_BLOCK_ODD: 
      return high_schooler ? SpecialBlockOddSchedule : HSSpecialBlockOddScheduleFor78; 
      break; 
    case Schedule.SBAC_SPECIAL_BLOCK_EVEN: 
      return high_schooler ? SpecialBlockEvenSchedule : HSSpecialBlockEvenScheduleFor78; 
      break; 
    //pre-finals schedules are the same across all grades, hence there are no switches/ternary operators
    case Schedule.PRE_FINALS_3264: 
      return PreFinals3264Schedule; 
      break; 
    case Schedule.PRE_FINALS_2156: 
      return PreFinals2156Schedule; 
      break; 
    case Schedule.PRE_FINALS_1345: 
      return PreFinals1345Schedule; 
      break; 
    case Schedule.ASSEMBLY: 
      switch(grade) {
        case 7: 
          return AssemblySchedule7; 
          break; 
        case 8: 
          return AssemblySchedule8; 
          break; 
        case 9: 
        case 10: 
        case 11: 
        case 12: 
          return AssemblySchedule; 
          break; 
        default: 
          return AssemblySchedule; 
          break; 
      } 
      
      /* 
      if(grade == '9-12') {
        return AssemblySchedule; 
      } else if(grade == '8') {
        return AssemblySchedule8; 
      } else {
        return AssemblySchedule7; 
      } 
      */ 
      
      break; 
    case Schedule.FINAL_ASSEMBLY: 
      if(grade == 12) {
        return FinalAssemblySchedule12; 
      } else if(high_schooler) {
        //just a normal assembly schedule
        return AssemblySchedule; 
      } else {
        return FinalAssemblySchedule78; 
      } 
      break; 
    case Schedule.FINALS_34: 
      return Finals34Schedule; 
      break; 
    case Schedule.FINALS_15: 
      return Finals15Schedule; 
      break; 
    case Schedule.FINALS_26: 
      return Finals26Schedule; 
      break; 
    case Schedule.FINALS_TBD: 
      return FinalsTBDSchedule; 
      break; 
    //Hypothetically, this would also be used to convey a 9-12 early release day. However, 9-12 
    //doesn't seem to have any. 
    case Schedule.EARLY_RELEASE: 
      return EarlyReleaseSchedule78; 
      break; 
    case Schedule.MINIMUM: 
      return MinimumSchedule; 
      break; 
    case Schedule.SUMMER_SCHOOL: 
      return SummerSchoolSchedule; 
      break; 
    default: 
      return NoSchoolSchedule; 
      break; 
  } 
}

export function getPeriod(time: number, schedule: Schedule, grade: number): any {
  const fullSchedule = getFullSchedule(schedule, grade); 
  return fullSchedule.find((p: any) => (p.start <= time && p.end > time)); 
}

const periodsFilter = [
  Period.PERIOD_0,
  Period.PERIOD_1,
  Period.PERIOD_2,
  Period.PERIOD_3,
  Period.PERIOD_4,
  Period.PERIOD_5,
  Period.PERIOD_6,
  Period.LUNCH,
  Period.BREAK,
  Period.STEP_ODD,
  Period.STEP_EVEN,
  Period.HOMEROOM,
  Period.ASSEMBLY,
  Period.TBD,
]

export function getUpcomingPeriod(time: number, dateTime: any, schedule: Schedule, grade: number, pAllow = periodsFilter): any {
  const fullSchedule = getFullSchedule(schedule, grade)
  const result = fullSchedule.find((p: any) => (p.start > time && pAllow.indexOf(p.period) !== -1))
  if (result) { return result }
  else {
    // Find the next period across next multiple days
    // TODO: remove the limit
    let daysSince = 1
    while (daysSince < 1000) {
      const nextDate = dateTime.plus({ days: daysSince }).set({ hour: 0, minute: 0 })
      const nextSchedule = getFullSchedule(
        getScheduleFromDay(nextDate.month, nextDate.day, nextDate.year, nextDate.weekday, grade), grade
      )
      
      const result = nextSchedule.find((p: any) => (p.start > 0 && pAllow.indexOf(p.period) !== -1))

      if (result) { return {...result, daysSince } }
      else { daysSince += 1 }
    }

    // TODO: replace Period.NONE with something else
    return { start: 0, end: 1440, period: Period.NONE, daysSince: daysSince }; 
  }
}

// This works so far, not touching.
// TODO: evaluate if needed
export function printTime(time: number) {
  let shortMins, hours, finalString;

  if (time > 59) {
    hours = Math.floor(time / 60);
    shortMins = time - hours * 60;
  } else {
    hours = 0;
    shortMins = time;
  }

  if (hours == 0) {
    if (shortMins == 1) {
      finalString = shortMins + ' minute';
    }
    else {
      finalString = shortMins + ' minutes';
    }
  } else if (hours == 1) {
    if (shortMins == 1) {
      finalString = hours + ' hour and ', shortMins + ' minute';
    }
    else {
      finalString = hours + ' hour and ' + shortMins + ' minutes';
    }
  } else {
    if (shortMins == 1) {
      finalString = hours + ' hours and ' + shortMins + ' minute';
    }
    else {
      finalString = hours + ' hours and ' + shortMins + ' minutes';
    }
  }

  return finalString;
}
