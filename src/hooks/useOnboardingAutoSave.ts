import type {StudentForm, User} from "../types.ts"
import {useEffect} from "react";

export default function useOnboardingAutoSave(step: number, studentData: Partial<StudentForm>, user: User) {
    useEffect(() => {
        const saveProgress = async () => {
            try {
                const response = await fetch("http://localhost:3000/users/", {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userData: user.onboardingStep,
                        studentData: studentData,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to register student');
                }
            } catch (e) {
                console.error(e);
            }

        }

        saveProgress();
    }, [step]);
}