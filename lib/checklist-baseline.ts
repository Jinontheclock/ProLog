import skillsData from '@/data/skills-competency-summary.json';

// Instructor sign-offs already on record when the demo starts. Counts mirror
// the School tab's "before" state (14 theory + 10 practical), taken in order
// from the competency summary so the ids always exist.
const SIGNED_OFF_COUNTS: Record<string, { Theory: number; Practical: number }> = {
  'Line A': { Theory: 7, Practical: 3 },
  'Line B': { Theory: 2, Practical: 2 },
  'Line C': { Theory: 1, Practical: 2 },
  'Line D': { Theory: 1, Practical: 1 },
  'Line G': { Theory: 2, Practical: 1 },
  'Line H': { Theory: 1, Practical: 1 },
};

type CompetencyItem = {
  id: string;
  Title: string;
  Category: string;
};

const buildBaseline = (): Set<string> => {
  const levelData = (skillsData as any)['level 1'] as Record<string, CompetencyItem[]>;
  const signedOff = new Set<string>();

  for (const [line, counts] of Object.entries(SIGNED_OFF_COUNTS)) {
    const comps = levelData[line] ?? [];
    for (const category of ['Theory', 'Practical'] as const) {
      let remaining = counts[category];
      for (const comp of comps) {
        if (remaining <= 0) break;
        if (comp.Category === category) {
          signedOff.add(comp.id);
          remaining -= 1;
        }
      }
    }
  }

  return signedOff;
};

export const BASELINE_SIGNED_OFF = buildBaseline();

// A competency counts as done when the instructor baseline has it or the
// user earned it in-app (quiz flow → completionStore)
export const checklistCompleted = (
  id: string,
  storeCompleted: string[]
): boolean => BASELINE_SIGNED_OFF.has(id) || storeCompleted.includes(id);
