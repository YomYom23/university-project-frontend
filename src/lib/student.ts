import type { Student } from "../types";

// Student carries firstName / lastName / dateOfBirth because that is what
// StudentProfile stores. Display name and age are derived here rather than
// held as their own fields, which would duplicate the source data and drift
// from it — an `age` column is wrong the day after every birthday.

type NameParts = Partial<Pick<Student, "firstName" | "lastName">>;

export function fullName(student: NameParts): string {
    return [student.firstName, student.lastName].filter(Boolean).join(" ").trim();
}

export function ageOf(student: Partial<Pick<Student, "dateOfBirth">>): number | undefined {
    if (!student.dateOfBirth) return undefined;

    const born = new Date(student.dateOfBirth);
    if (Number.isNaN(born.getTime())) return undefined;

    const today = new Date();
    let age = today.getFullYear() - born.getFullYear();

    // Roll back a year when this year's birthday hasn't happened yet.
    const monthsUntilBirthday = today.getMonth() - born.getMonth();
    if (monthsUntilBirthday < 0 || (monthsUntilBirthday === 0 && today.getDate() < born.getDate())) {
        age -= 1;
    }

    return age >= 0 ? age : undefined;
}
