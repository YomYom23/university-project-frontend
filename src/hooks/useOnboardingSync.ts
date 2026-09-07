import { useCallback, useEffect, useRef, useState } from "react";
import type { StudentForm } from "../types.ts";
import { fetchOnboarding, profileToForm, saveOnboarding } from "../api/onboarding.ts";

export interface RestoredOnboarding {
    step: number;
    form: Partial<StudentForm>;
}

// Owns the network side of student onboarding: restores saved progress on
// mount, and persists the form on each step transition. The form state itself
// stays in the page — this hook only moves it to and from the API.
//
// `enabled` is false for the university flow, which is not wired to the API
// yet; the hook still has to be called (rules of hooks), so it short-circuits.
export default function useOnboardingSync(
    enabled: boolean,
    onRestore: (restored: RestoredOnboarding) => void,
) {
    const [loading, setLoading] = useState(enabled);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Kept in a ref so an inline callback from the page doesn't change the
    // load effect's identity and re-restore over edits already in progress.
    const restore = useRef(onRestore);

    useEffect(() => {
        restore.current = onRestore;
    }, [onRestore]);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;

        const load = async () => {
            try {
                const { user, studentProfile } = await fetchOnboarding();
                if (cancelled) return;

                restore.current({
                    step: user?.onboardingStep ?? 0,
                    form: studentProfile ? profileToForm(studentProfile) : {},
                });
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Could not load your saved progress");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [enabled]);

    // Resolves true when the step was persisted. The caller advances only on
    // true, so a failed save doesn't move the user past unsaved answers.
    const save = useCallback(
        async (step: number, form: Partial<StudentForm>): Promise<boolean> => {
            if (!enabled) return true;

            setSaving(true);
            setError(null);

            try {
                await saveOnboarding(step, form);
                return true;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not save your progress");
                return false;
            } finally {
                setSaving(false);
            }
        },
        [enabled],
    );

    const dismissError = useCallback(() => setError(null), []);

    return { loading, saving, error, save, dismissError };
}
