// Shared types
export type Vibe =
    | 'Research-Focused' | 'Liberal Arts' | 'Sports Culture' | 'City Life'
    | 'Rural Campus' | 'Tech Hub' | 'Creative Arts' | 'Greek Life'
    | 'Diverse Community' | 'Outdoorsy' | 'International' | 'Tight-Knit';

export type Size = 'Small' | 'Medium' | 'Large';

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    age: number | string;
    country: string;
    email?: string;
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
    setUser: React.Dispatch<React.SetStateAction<Student | University | null>>;
    refreshUser: () => Promise<void>;
}
