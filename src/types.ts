// Shared types
import type {Dispatch, SetStateAction} from "react";

export type Vibe =
    | 'Research-Focused' | 'Liberal Arts' | 'Sports Culture' | 'City Life'
    | 'Rural Campus' | 'Tech Hub' | 'Creative Arts' | 'Greek Life'
    | 'Diverse Community' | 'Outdoorsy' | 'International' | 'Tight-Knit';

export type Size = 'Small' | 'Medium' | 'Large';

export interface User {
    id: string;
    role: 'student' | 'university';
    onboardingStep: number;
    email?: string;
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
    gpa: number;
    sat: number | string;
    act?: number | string;
    major: string;
    highSchool?: string;
    graduationYear: number;
    classRank?: string;
    preferredMajors: string[];
    preferredLocations: string[];
    size?: Size;
    budgetRange: [number, number];
    campusVibes: string[];
    extracurriculars: string[];
    careerGoal: string;
    priority?: string;
}

export interface University {
    id: string;
    name: string;
    short: string;
    location: string;
    website?: string;
    founded?: number | string;
    tagline: string;
    acceptanceRate: number;
    avgGpa: number;
    tuition: number;
    size: Size;
    enrollment: number;
    programs: string[];
    campusVibes: string[];
    scholarships: boolean;
    scholarshipDetails?: string;
    minGpaRequired: number;
    preferredMajors: string[];
    preferredActivities: string[];
    specialPrograms?: string;
    logoColor: string;
}

export interface MatchBreakdown {
    academics: number;
    budget: number;
    major: number;
    vibe: number;
    location: number;
}

export interface MatchResult {
    score: number;
    breakdown: MatchBreakdown;
}

export interface NavItem {
    key: string;
    label: string;
    icon: string;
    badge?: number | null;
}

export interface AuthContextType {
    user: Student | University | null;
    isLoading: boolean;
    // Use the named React types (Dispatch/SetStateAction). Referencing the
    // `React.*` namespace fails here because verbatimModuleSyntax + react-jsx
    // means there is no global `React` unless it is explicitly imported.
    setUser: Dispatch<SetStateAction<Student | University | null>>;
    // Re-checks /auth/status and refreshes `user`. Call after login/signup so
    // the context picks up the new session cookie.
    refreshUser: () => Promise<void>;
}