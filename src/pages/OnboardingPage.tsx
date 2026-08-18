import {useState, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../hooks/useAuth.tsx";
import {motion, AnimatePresence} from 'framer-motion';
import {ChevronLeft, ChevronRight, ArrowRight, Upload} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import {Input, Textarea, Select} from '../components/ui/Input';
import Segmented from '../components/ui/Segmented';
import Toggle from '../components/ui/Toggle';
import {RangeSlider, DualRangeSlider} from '../components/ui/RangeSlider';
import MultiChipSelect from '../components/ui/MultiChipSelect';
import StepProgress from '../components/ui/StepProgress';
import {VIBE_TAGS, MAJORS, ACTIVITIES, LOCATIONS, COUNTRIES, SETTINGS, SUPPORT_NEEDS} from '../data/options';
import type {Student, University} from '../types';

type StudentForm = Partial<Student> & {
    preferredMajors: string[]; preferredLocations: string[]; campusVibes: string[];
    extracurriculars: string[]; budgetRange: [number, number]; gpa: number;
    // Fields below are informed by the college-fit data taxonomy (A2, A3, B6, B7, B10):
    // GPA/test values are only comparable with context, so we capture that context
    // instead of a bare number, and cost/support signals are collected early (cost-first).
    gpaScale: 'Weighted' | 'Unweighted';
    submittingScores: boolean;
    settingPreference: string[];
    distanceTolerance: number;
    needsFinancialAid: boolean;
    supportNeeds: string[];
    riskTolerance: 'Mostly safety' | 'Balanced list' | 'Reach-heavy';
};
type UniForm = Partial<University> & {
    programs: string[]; campusVibes: string[]; preferredMajors: string[]; preferredActivities: string[];
    // Fields below reflect the taxonomy's highest-value, most-requested college-side signals
    // (A3 test policy, B2 need-met %, B5 Pell % as a socioeconomic-diversity proxy, A10 demonstrated interest).
    testPolicy: 'Required' | 'Test-optional' | 'Test-free';
    needMetPercent: number;
    pellPercent: number;
    tracksDemonstratedInterest: boolean;
    firstGenSupport: boolean;
};

const defaultStudent= (): StudentForm => ({
    firstName: undefined,
    lastName: undefined,
    age: undefined,
    country: undefined,
    email: undefined,
    gpa: 3.7,
    sat: undefined,
    highSchool: undefined,
    graduationYear: 2026,
    classRank: undefined,
    preferredMajors: undefined,
    preferredLocations: undefined,
    size: 'Medium',
    budgetRange: [20000, 50000],ç
    campusVibes: undefined,
    extracurriculars: undefined,
    careerGoal: undefined,
    priority: undefined,
    gpaScale: 'Unweighted',
    submittingScores: true,
    settingPreference: undefined,
    distanceTolerance: 500,
    needsFinancialAid: true,
    supportNeeds: undefined,
    riskTolerance: 'Balanced list',
});
});
const defaultUni = (): UniForm => ({
    name: '', location: '', website: '', founded: '', tagline: '',
    acceptanceRate: 25, avgGpa: 3.6, programs: [], size: 'Medium',
    tuition: 40000, campusVibes: [], scholarships: true, scholarshipDetails: '',
    minGpaRequired: 3.4, preferredMajors: [], preferredActivities: [], specialPrograms: '',
    testPolicy: 'Test-optional', needMetPercent: 70, pellPercent: 20,
    tracksDemonstratedInterest: false, firstGenSupport: true,
});

function StepShell({title, hint, children, k}: { title: string; hint?: string; children: ReactNode; k: string }) {
    return (
        <motion.div key={k}
                    initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.4}}
                    style={{display: 'flex', flexDirection: 'column', gap: 22}}>
            <div>
                <h2 className="h2">{title}</h2>
                {hint && <p className="mute" style={{marginTop: 6}}>{hint}</p>}
            </div>
            {children}
        </motion.div>
    );
}

function PhotoUpload({name, accent}: { name?: string; accent?: string }) {
    const [uploaded, setUploaded] = useState(false);
    return (
        <div className="field">
            <label>Profile photo</label>
            <button onClick={() => setUploaded(true)} className="glass"
                    style={{
                        padding: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        cursor: 'pointer',
                        textAlign: 'left'
                    }}>
                {uploaded ? <Avatar name={name || '?'} size={56} gradient={accent}/> : (
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px dashed var(--border-strong)',
                        color: 'var(--text-2)',
                    }}>
                        <Upload size={20}/>
                    </div>
                )}
                <div>
                    <div style={{fontWeight: 600}}>{uploaded ? 'Photo selected' : 'Upload a photo'}</div>
                    <div className="mute text-xs">{uploaded ? 'Click to replace' : 'PNG or JPG, up to 5MB (mock)'}</div>
                </div>
            </button>
        </div>
    );
}

const STUDENT_STEPS = ['You', 'Academics', 'Preferences', 'Goals'];
const UNI_STEPS = ['Basics', 'Academics', 'Campus', 'Ideal Student'];

interface Props {
    role: 'student' | 'university'
}

export default function OnboardingPage({role}: Props) {
    const { user } = useAuth();
    const isStudent = role === 'student';
    const navigate = useNavigate();
    const steps = isStudent ? STUDENT_STEPS : UNI_STEPS;
    const [step, setStep] = useState(user?.onboardingStep || 0);
    const [studentData, setStudentData] = useState<StudentForm>(defaultStudent());

    const [uniData, setUniData] = useState<UniForm>(defaultUni());

    const studentSet = (payload: Partial<StudentForm>) => setStudentData((data) => ({...data, ...payload}));
    const uniSet = (payload: Partial<UniForm>) => setUniData((data) => ({...data, ...payload}));

    const next = async () => {

        if (step === steps.length - 1) {
            try {
                if (isStudent) {
                    const url = "http://localhost:3000/users/"
                    const response = await fetch(url, {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userData: studentData,
                            onboardingStep: step + 1,
                        }),
                    });

                    if (!response.ok) throw new Error('Failed to register student');
                    const result = await response.json();
                    console.log(result);

                    localStorage.setItem('um.student', JSON.stringify(studentData))
                } else localStorage.setItem('um.university', JSON.stringify(uniData));
            } catch (e) {
                console.log("An error has occured: ", e)
            }
            navigate(isStudent ? '/student/dashboard' : '/university/dashboard');
        } else {
            try {
                const res = await fetch(`http://localhost:3000/users/`, {
                    method: "PATCH",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        onboardingStep: step + 1,
                    }),
                });
                setStep((currStep) => currStep + 1);
                if (!res.ok) throw new Error('Failed to update user step');
                const result = await res.json();
                console.log(result);
            } catch (e) {
                console.log("Error: ", e)
            }

            console.log(studentData)
        }
    };
    const back = async () => {
        console.log("sending data: ", studentData)
        if(step > 0 ){
            setStep((currStep: number) => currStep - 1)
            const res = await fetch(`http://localhost:3000/users/`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userData: studentData,
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to update user step');
            }
            const result = await res.json();
            console.log(result);
        } else { navigate('/') }
    };

    const renderStudent = () => {
        const data = studentData;
        if (step === 0) return (
            <StepShell k="s0" title="Tell us about you"
                       hint="The basics, so universities know who they're matching with.">
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <Input label="First name" value={data.firstName || ''}
                           onChange={(value) => studentSet({firstName: value})} placeholder="Aria"/>
                    <Input label="Last name" value={data.lastName || ''}
                           onChange={(value) => studentSet({lastName: value})} placeholder="Patel"/>
                    <Input label="Date of birth" type="date" value={data.age ?? ''}
                           onChange={(value) => studentSet({age: value})}/>
                    <Select label="Country" value={data.country || ''}
                            onChange={(value) => studentSet({country: value})} options={[...COUNTRIES]}/>
                </div>
                <PhotoUpload name={`${data.firstName} ${data.lastName}`}/>
            </StepShell>
        );
        if (step === 1) return (
            <StepShell k="s1" title="Academics" hint="What you've earned. We'll match it to schools that fit.">
                <div className="field"><label>GPA scale</label>
                    <Segmented options={['Weighted', 'Unweighted']} value={data.gpaScale}
                               onChange={(value) => studentSet({gpaScale: value as 'Weighted' | 'Unweighted'})}/>
                    <span className="mute text-xs" style={{marginTop: 4}}>Schools recalculate GPA differently — telling us the scale keeps your matches honest.</span>
                </div>
                <RangeSlider label="GPA" min={0} max={4} step={0.01}
                             value={data.gpa} onChange={(value) => studentSet({gpa: value})}
                             format={(value) => value.toFixed(2)}/>
                <div className="field"><label>Standardized testing</label>
                    <Segmented options={['Submitting scores', 'Not submitting (test-optional)']}
                               value={data.submittingScores ? 'Submitting scores' : 'Not submitting (test-optional)'}
                               onChange={(value) => studentSet({submittingScores: value === 'Submitting scores'})}/>
                </div>
                {data.submittingScores && (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                        <Input label="SAT score" type="number" value={data.sat ?? ''}
                               onChange={(value) => studentSet({sat: value})} placeholder="1450"/>
                        <Input label="ACT score (optional)" type="number" value={data.act ?? ''}
                               onChange={(value) => studentSet({act: value})} placeholder="32"/>
                    </div>
                )}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <Input label="High School" value={data.highSchool || ''}
                           onChange={(value) => studentSet({highSchool: value})} placeholder="Lincoln High"/>
                    <Input label="Graduation year" type="number" value={data.graduationYear ?? ''}
                           onChange={(value) => studentSet({graduationYear: Number(value)})} placeholder="2026"/>
                </div>
                <Input label="Class rank (optional)" value={data.classRank || ''}
                       onChange={(value) => studentSet({classRank: value})} placeholder="12 of 320"/>
            </StepShell>
        );
        if (step === 2) return (
            <StepShell k="s2" title="What are you looking for?"
                       hint="Get specific. The more honest, the better the matches.">
                <div className="field"><label>Preferred majors</label>
                    <MultiChipSelect options={MAJORS} value={data.preferredMajors}
                                     onChange={(value) => studentSet({preferredMajors: value})}/></div>
                <div className="field"><label>Preferred locations</label>
                    <MultiChipSelect options={LOCATIONS} value={data.preferredLocations}
                                     onChange={(value) => studentSet({preferredLocations: value})}/></div>
                <div className="field"><label>Setting</label>
                    <MultiChipSelect options={SETTINGS} value={data.settingPreference}
                                     onChange={(value) => studentSet({settingPreference: value})}/></div>
                <RangeSlider label="How far from home are you willing to go?" min={0} max={3000} step={50}
                             value={data.distanceTolerance} onChange={(value) => studentSet({distanceTolerance: value})}
                             format={(value) => value >= 3000 ? 'Anywhere' : `${value} mi`}/>
                <div className="field"><label>University size</label>
                    <Segmented options={['Small', 'Medium', 'Large']} value={data.size || ''}
                               onChange={(value) => studentSet({size: value as 'Small' | 'Medium' | 'Large'})}/></div>
                <DualRangeSlider label="Budget range ($/year)" min={10000} max={80000} step={1000}
                                 value={data.budgetRange} onChange={(value) => studentSet({budgetRange: value})}
                                 format={(value) => `$${(value / 1000).toFixed(0)}k`}/>
                <div className="field"><label>Will you need financial aid to attend?</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                        <Toggle value={!!data.needsFinancialAid} onChange={(value) => studentSet({needsFinancialAid: value})}/>
                        <span className="mute text-sm">{data.needsFinancialAid ? 'Yes — prioritize net price & aid' : 'No — cost is not a constraint'}</span>
                    </div>
                </div>
                <div className="field"><label>Desired campus vibe</label>
                    <MultiChipSelect options={[...VIBE_TAGS]} value={data.campusVibes}
                                     onChange={(value) => studentSet({campusVibes: value})}/></div>
            </StepShell>
        );
        return (
            <StepShell k="s3" title="Goals & activities" hint="What makes your application yours.">
                <div className="field"><label>Extracurricular activities</label>
                    <MultiChipSelect options={ACTIVITIES} value={data.extracurriculars}
                                     onChange={(value) => studentSet({extracurriculars: value})}/></div>
                <Textarea label="Career goals" value={data.careerGoal || ''}
                          onChange={(value) => studentSet({careerGoal: value})}
                          placeholder="In a few sentences, what do you want to do with your degree?" rows={3}/>
                <div className="field"><label>Support you'd like schools to offer (optional)</label>
                    <MultiChipSelect options={SUPPORT_NEEDS} value={data.supportNeeds}
                                     onChange={(value) => studentSet({supportNeeds: value})}/></div>
                <div className="field"><label>How do you want your list balanced?</label>
                    <Segmented options={['Mostly safety', 'Balanced list', 'Reach-heavy']} value={data.riskTolerance}
                               onChange={(value) => studentSet({riskTolerance: value as StudentForm['riskTolerance']})}/>
                </div>
                <Select label="One thing most important to you" value={data.priority || ''}
                        onChange={(value) => studentSet({priority: value})}
                        options={['Academic rigor', 'Career opportunities', 'Campus community', 'Affordability', 'Location', 'Specific program reputation']}/>
            </StepShell>
        );
    };

    const renderUni = () => {
        const data = uniData;
        if (step === 0) return (
            <StepShell k="u0" title="University basics" hint="Students will see this first.">
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <Input label="University name" value={data.name || ''} onChange={(value) => uniSet({name: value})}
                           placeholder="Cascadia Institute of Technology"/>
                    <Input label="Location" value={data.location || ''} onChange={(value) => uniSet({location: value})}
                           placeholder="Seattle, WA"/>
                    <Input label="Website" value={data.website || ''} onChange={(value) => uniSet({website: value})}
                           placeholder="cit.edu"/>
                    <Input label="Year founded" type="number" value={data.founded ?? ''}
                           onChange={(value) => uniSet({founded: value})} placeholder="1901"/>
                </div>
                <PhotoUpload name={data.name} accent="linear-gradient(135deg, #6366f1, #8b5cf6)"/>
                <Textarea label="Tagline" value={data.tagline || ''} onChange={(value) => uniSet({tagline: value})}
                          placeholder="One line that captures what makes you, you." rows={2}/>
            </StepShell>
        );
        if (step === 1) return (
            <StepShell k="u1" title="Academics" hint="The numbers prospective students care about.">
                <RangeSlider label="Acceptance rate" min={1} max={100} step={1} value={data.acceptanceRate ?? 25}
                             onChange={(value) => uniSet({acceptanceRate: value})} format={(value) => `${value}%`}/>
                <RangeSlider label="Average GPA of accepted students" min={2} max={4} step={0.01}
                             value={data.avgGpa ?? 3.6}
                             onChange={(value) => uniSet({avgGpa: value})} format={(value) => value.toFixed(2)}/>
                <div className="field"><label>Standardized test policy</label>
                    <Segmented options={['Required', 'Test-optional', 'Test-free']} value={data.testPolicy}
                               onChange={(value) => uniSet({testPolicy: value as UniForm['testPolicy']})}/>
                    <span className="mute text-xs" style={{marginTop: 4}}>Policies are changing school-by-school — students weigh this heavily, so keep it current each cycle.</span>
                </div>
                <div className="field"><label>Programs offered</label>
                    <MultiChipSelect options={MAJORS} value={data.programs}
                                     onChange={(value) => uniSet({programs: value})}/></div>
                <div className="field"><label>University size</label>
                    <Segmented options={['Small', 'Medium', 'Large']} value={data.size || ''}
                               onChange={(value) => uniSet({size: value as 'Small' | 'Medium' | 'Large'})}/></div>
            </StepShell>
        );
        if (step === 2) return (
            <StepShell k="u2" title="Campus profile" hint="Who you are beyond academics.">
                <RangeSlider label="Tuition ($/year)" min={5000} max={80000} step={1000} value={data.tuition ?? 40000}
                             onChange={(value) => uniSet({tuition: value})}
                             format={(value) => `$${(value / 1000).toFixed(0)}k`}/>
                <RangeSlider label="Average % of financial need met" min={0} max={100} step={5}
                             value={data.needMetPercent} onChange={(value) => uniSet({needMetPercent: value})}
                             format={(value) => `${value}%`}/>
                <RangeSlider label="% of students receiving Pell grants" min={0} max={100} step={5}
                             value={data.pellPercent} onChange={(value) => uniSet({pellPercent: value})}
                             format={(value) => `${value}%`}/>
                <div className="field"><label>Campus vibe tags</label>
                    <MultiChipSelect options={[...VIBE_TAGS]} value={data.campusVibes}
                                     onChange={(value) => uniSet({campusVibes: value})}/></div>
                <div className="field"><label>Scholarships available</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                        <Toggle value={!!data.scholarships} onChange={(value) => uniSet({scholarships: value})}/>
                        <span
                            className="mute text-sm">{data.scholarships ? 'Yes — multiple programs available' : 'No'}</span>
                    </div>
                </div>
                {data.scholarships && (
                    <Textarea label="Scholarship details" value={data.scholarshipDetails || ''}
                              onChange={(value) => uniSet({scholarshipDetails: value})}
                              placeholder="Brief description of available scholarships, eligibility, etc." rows={3}/>
                )}
            </StepShell>
        );
        return (
            <StepShell k="u3" title="Your ideal student" hint="Who do you most want to hear from?">
                <RangeSlider label="Minimum GPA accepted" min={2} max={4} step={0.01} value={data.minGpaRequired ?? 3.4}
                             onChange={(value) => uniSet({minGpaRequired: value})}
                             format={(value) => value.toFixed(2)}/>
                <div className="field"><label>Preferred majors</label>
                    <MultiChipSelect options={MAJORS} value={data.preferredMajors}
                                     onChange={(value) => uniSet({preferredMajors: value})}/></div>
                <div className="field"><label>Activities you value</label>
                    <MultiChipSelect options={ACTIVITIES} value={data.preferredActivities}
                                     onChange={(value) => uniSet({preferredActivities: value})}/></div>
                <div className="field"><label>Do you track demonstrated interest?</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                        <Toggle value={!!data.tracksDemonstratedInterest} onChange={(value) => uniSet({tracksDemonstratedInterest: value})}/>
                        <span className="mute text-sm">{data.tracksDemonstratedInterest ? 'Yes — visits & engagement factor in' : "No — it doesn't affect decisions"}</span>
                    </div>
                </div>
                <div className="field"><label>Dedicated first-generation student support?</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                        <Toggle value={!!data.firstGenSupport} onChange={(value) => uniSet({firstGenSupport: value})}/>
                        <span className="mute text-sm">{data.firstGenSupport ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <Textarea label="Special programs (optional)" value={data.specialPrograms || ''}
                          onChange={(value) => uniSet({specialPrograms: value})}
                          placeholder="Honors college, BS/MD, signature scholarships, research initiatives..."
                          rows={3}/>
            </StepShell>
        );
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 14}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}
            transition={{duration: 0.45}}
            style={{position: 'relative', minHeight: '100vh'}}
        >

            <nav style={{
                position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '22px 32px', maxWidth: 1160, margin: '0 auto',
            }}>
                <button onClick={() => navigate('/')} style={{display: 'flex', alignItems: 'center', gap: 9}}>
                    <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: 'var(--text)', color: 'var(--bg)', display: 'grid', placeItems: 'center',
                        fontWeight: 700, fontSize: 12, letterSpacing: '-0.02em',
                    }}>U
                    </div>
                    <div style={{fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em'}}>UniMatch</div>
                </button>
                <Badge>{isStudent ? 'Student onboarding' : 'University onboarding'}</Badge>
            </nav>

            <div style={{position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px'}}>
                <div style={{marginBottom: 28}}>
                    <StepProgress steps={steps} current={step}/>
                </div>
                <Card style={{padding: '32px 28px'}}>
                    <AnimatePresence mode="wait">
                        {isStudent ? renderStudent() : renderUni()}
                    </AnimatePresence>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12}}>
                        <Button variant="ghost" onClick={back} icon={<ChevronLeft size={16}/>}>
                            {step === 0 ? 'Cancel' : 'Back'}
                        </Button>
                        <Button onClick={next} iconRight={step === steps.length - 1 ? <ArrowRight size={16}/> :
                            <ChevronRight size={16}/>}>
                            {step === steps.length - 1 ? 'Complete profile' : `Continue (${step + 1}/${steps.length})`}
                        </Button>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}
