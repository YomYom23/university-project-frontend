import type { StudentForm, User } from "../types.ts";

const API_BASE = "http://localhost:3000";

// The columns StudentProfile actually has. Fields the form collects but the
// table doesn't store — gpaScale, submittingScores, settingPreference,
// distanceTolerance, needsFinancialAid, supportNeeds, riskTolerance — stay
// client-side and are simply not sent.
export interface SavedStudentProfile {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    country: string | null;
    phone: string | null;
    gpa: number | null;
    satScore: number | null;
    actScore: number | null;
    highSchool: string | null;
    graduationYear: string | null;
    classRank: string | null;
    major: string | null;
    preferredMajors: string[] | null;
    preferredLocations: string[] | null;
    preferredRegion: string | null;
    size: "SMALL" | "MEDIUM" | "LARGE" | null;
    budgetRange: number[] | null;
    campusVibes: string[] | null;
    extracurriculars: string[] | null;
    careerGoals: string | null;
    priority: string | null;
}

export interface OnboardingSnapshot {
    user: User | null;
    studentProfile: SavedStudentProfile | null;
}

// The form labels its sizes in title case; the CampusSize enum is upper case.
const SIZE_LABELS = { SMALL: "Small", MEDIUM: "Medium", LARGE: "Large" } as const;

// `<input type="date">` only accepts YYYY-MM-DD, but the column is a
// timestamp, so a stored value can come back with a time component attached.
const toDateInputValue = (stored: string | null): string | undefined =>
    stored ? stored.slice(0, 10) : undefined;

const orUndefined = <T>(value: T | null): T | undefined => value ?? undefined;

// Profile row → form state. Only the keys the row actually holds are returned,
// so spreading this over the defaults leaves untouched fields at their default.
export function profileToForm(profile: SavedStudentProfile): Partial<StudentForm> {
    const form: Partial<StudentForm> = {
        firstName: orUndefined(profile.firstName),
        lastName: orUndefined(profile.lastName),
        dateOfBirth: toDateInputValue(profile.dateOfBirth),
        country: orUndefined(profile.country),
        gpa: orUndefined(profile.gpa),
        satScore: orUndefined(profile.satScore),
        act: orUndefined(profile.actScore),
        highSchool: orUndefined(profile.highSchool),
        graduationYear: profile.graduationYear ? Number(profile.graduationYear) : undefined,
        classRank: orUndefined(profile.classRank),
        major: orUndefined(profile.major),
        preferredMajors: orUndefined(profile.preferredMajors),
        preferredLocations: orUndefined(profile.preferredLocations),
        size: profile.size ? SIZE_LABELS[profile.size] : undefined,
        campusVibes: orUndefined(profile.campusVibes),
        extracurriculars: orUndefined(profile.extracurriculars),
        careerGoal: orUndefined(profile.careerGoals),
        priority: orUndefined(profile.priority),
        // budgetRange is a two-element tuple in the form; ignore a stored value
        // that isn't the right shape rather than half-applying it.
        budgetRange:
            profile.budgetRange?.length === 2
                ? [profile.budgetRange[0]!, profile.budgetRange[1]!]
                : undefined,
    };

    return Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== undefined),
    ) as Partial<StudentForm>;
}

async function readError(response: Response): Promise<string> {
    try {
        const body = await response.json();
        return body?.error ?? body?.message ?? `Request failed (${response.status})`;
    } catch {
        return `Request failed (${response.status})`;
    }
}

// Loads the saved user + profile so onboarding resumes where it left off
// instead of restarting from the defaults on every visit.
export async function fetchOnboarding(): Promise<OnboardingSnapshot> {
    const response = await fetch(`${API_BASE}/users/me`, { credentials: "include" });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const body = await response.json();
    return body.data as OnboardingSnapshot;
}

// Persists the step the user is moving to along with everything captured so
// far. The server maps and whitelists the payload, so sending the whole form
// each time is safe and keeps the client from having to slice it per step.
export async function saveOnboarding(
    step: number,
    studentData: Partial<StudentForm>,
): Promise<OnboardingSnapshot> {
    const response = await fetch(`${API_BASE}/users/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userData: { onboardingStep: step },
            studentData,
        }),
    });

    if (!response.ok) {
        throw new Error(await readError(response));
    }

    const body = await response.json();
    return body.data as OnboardingSnapshot;
}
