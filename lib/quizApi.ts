export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

// Portfolio demo build: the live app generates quizzes with OpenAI, but the
// public demo ships no API key. Instead, each line carries its own bank of
// trade-accurate questions (topics follow the SkilledTradesBC Electrician
// Common Core Level 1 outline). The bank is chosen by the competency id's
// leading letter; "EXAM" draws a mixed set across every line.

type Bank = Record<string, QuizQuestion[]>;

const q = (
  question: string,
  correct: string,
  ...wrong: string[]
): QuizQuestion => ({
  question,
  options: [correct, ...wrong],
  correctAnswer: correct,
});

const LINE_BANKS: Bank = {
  // A — Apply Circuit Concepts
  A: [
    q(
      "In a series circuit, what is true of the current?",
      "It is the same through every component",
      "It divides between the components",
      "It is zero at the source",
      "It doubles across each resistor",
    ),
    q(
      "In a parallel circuit, what is the same across every branch?",
      "Voltage",
      "Current",
      "Resistance",
      "Power",
    ),
    q(
      "Three 30 Ω resistors connected in parallel have a total resistance of:",
      "10 Ω",
      "30 Ω",
      "60 Ω",
      "90 Ω",
    ),
    q(
      "What does a voltage divider do?",
      "Splits the source voltage across series resistors in proportion to their resistance",
      "Boosts the voltage above the source",
      "Stores charge for later use",
      "Converts AC to DC",
    ),
    q(
      "Passing current through a coiled conductor produces:",
      "A magnetic field around the coil",
      "A vacuum inside the coil",
      "Visible light",
      "No measurable effect",
    ),
  ],

  // B — Perform Safety-Related Functions
  B: [
    q(
      "Before working on a circuit, the first step is to:",
      "De-energize it and verify the absence of voltage with a tested meter",
      "Trust the label on the panel",
      "Ask a coworker if it should be off",
      "Put on gloves and start work",
    ),
    q(
      "A lock-out/tag-out procedure prevents:",
      "Unexpected re-energization of equipment while it is being worked on",
      "Tools from going missing",
      "Unscheduled coffee breaks",
      "Paperwork errors",
    ),
    q(
      "Arc flash PPE is selected based on:",
      "The incident energy level of the equipment being worked on",
      "The weather forecast",
      "The worker's seniority",
      "The size of the panel cover",
    ),
    q(
      "Class E hard hats are rated for:",
      "Electrical protection up to 20,000 volts",
      "Waterproofing",
      "Impact protection only",
      "High-visibility work zones",
    ),
    q(
      "The minimum approach distance to exposed energized parts depends on:",
      "The voltage level of the equipment",
      "The time of day",
      "The length of the shift",
      "The brand of tools used",
    ),
  ],

  // C — Use Tools and Equipment
  C: [
    q(
      "Which instrument measures current without breaking into the circuit?",
      "A clamp meter",
      "A voltmeter across the load",
      "A megohmmeter",
      "A continuity tester",
    ),
    q(
      "Before testing for the absence of voltage, a meter should be:",
      "Proven on a known live source first",
      "Set to resistance",
      "Shorted across its leads",
      "Left on auto-power-off",
    ),
    q(
      "A megohmmeter (megger) is used to test:",
      "Insulation resistance",
      "Lamp brightness",
      "Breaker trip time",
      "Conductor length",
    ),
    q(
      "An extension ladder should be set at about:",
      "75 degrees — one metre out for every four up",
      "45 degrees",
      "90 degrees, flat against the wall",
      "30 degrees",
    ),
    q(
      "Fish tape is used to:",
      "Pull conductors through raceways",
      "Measure voltage",
      "Strip insulation",
      "Bend conduit",
    ),
  ],

  // D — Organize Work
  D: [
    q(
      "A single-line diagram shows:",
      "The electrical distribution path in simplified form",
      "The exact physical routing of every wire",
      "The furniture layout",
      "The paint schedule",
    ),
    q(
      "When a drawing and the specification conflict, you should:",
      "Follow the contract's order of precedence and flag the conflict",
      "Ignore both documents",
      "Pick whichever is cheaper",
      "Wait until inspection to decide",
    ),
    q(
      "A material take-off is:",
      "A list of materials and quantities derived from the drawings",
      "A delivery truck schedule",
      "A supplier invoice",
      "A tool crib inventory",
    ),
    q(
      "As-built drawings record:",
      "The installation as it was actually constructed",
      "Only the original design intent",
      "Future renovation plans",
      "The project's cost estimates",
    ),
    q(
      "Keeping a daily site log matters because it:",
      "Documents work performed, hours and site conditions",
      "Replaces the drawings",
      "Is required for advertising",
      "Shortens the workday",
    ),
  ],

  // G — Use Communication and Mentoring Techniques
  G: [
    q(
      "Active listening means:",
      "Confirming understanding by restating what you heard",
      "Waiting for your turn to interrupt",
      "Nodding while thinking about lunch",
      "Taking over the other person's task",
    ),
    q(
      "A good mentor primarily:",
      "Demonstrates skills and gives constructive feedback",
      "Does the apprentice's work for them",
      "Keeps trade knowledge to themselves",
      "Assigns only cleanup duties",
    ),
    q(
      "Toolbox talks are:",
      "Short on-site meetings covering safety and work coordination",
      "Extended lunch breaks",
      "Tool sales demonstrations",
      "Equipment repair sessions",
    ),
    q(
      "If you receive an instruction you don't understand, you should:",
      "Ask clarifying questions before starting the task",
      "Guess and hope for the best",
      "Skip the task quietly",
      "Complain to another crew",
    ),
    q(
      "Clear labeling and documentation on site helps:",
      "The next worker continue the job safely and correctly",
      "Hide installation mistakes",
      "Increase material costs",
      "Slow down the schedule",
    ),
  ],

  // H — Install and Maintain Consumer/Supply Services and Metering
  H: [
    q(
      "A consumer's service includes:",
      "The conductors and equipment from the supply authority to the main service box",
      "Only the meter itself",
      "The branch circuit receptacles",
      "The luminaires",
    ),
    q(
      "A service mast supports:",
      "The overhead service conductors at the point of attachment",
      "The roof structure",
      "The panelboard cover",
      "The grounding electrode",
    ),
    q(
      "A kilowatt-hour meter measures:",
      "Electrical energy consumed over time",
      "Instantaneous voltage",
      "Insulation resistance",
      "Conductor temperature",
    ),
    q(
      "A typical residential single-phase service in Canada is:",
      "120/240 V, three-wire",
      "600 V three-phase",
      "12 V DC",
      "480 V two-wire",
    ),
    q(
      "The service disconnecting means must:",
      "Open all ungrounded conductors at the same time",
      "Open the neutral conductor first",
      "Be hidden from view",
      "Be installed outdoors only",
    ),
  ],

  // I — Install and Maintain Protection Devices
  I: [
    q(
      "The purpose of an overcurrent device is to:",
      "Open the circuit when current exceeds a safe value",
      "Boost the current",
      "Regulate the voltage",
      "Store energy for outages",
    ),
    q(
      "A GFCI protects people by:",
      "Detecting an imbalance between line and neutral current and opening quickly",
      "Limiting the circuit voltage",
      "Bonding the tool casing",
      "Warming the conductors",
    ),
    q(
      "AFCI protection is designed to detect:",
      "Dangerous arcing faults in wiring",
      "Power outages",
      "Low voltage conditions",
      "Meter tampering",
    ),
    q(
      "A time-delay fuse suits:",
      "Motor circuits with high starting inrush current",
      "Doorbell circuits only",
      "Data cabling",
      "Decorative lighting exclusively",
    ),
    q(
      "A breaker's interrupting rating must be:",
      "At least the available fault current at its location",
      "Lower than the load current",
      "Exactly 15 A in all cases",
      "Left unmarked",
    ),
  ],

  // J — Install and Maintain Low Voltage Distribution Systems
  J: [
    q(
      "A panelboard schedule identifies:",
      "Which circuit each breaker feeds",
      "The building's paint codes",
      "The utility meter number",
      "The conductor manufacturer",
    ),
    q(
      "A feeder is:",
      "The conductors between the service equipment and a downstream panel",
      "Any branch circuit",
      "A lamp cord",
      "The meter socket",
    ),
    q(
      "Balancing loads across both busbars of a 120/240 V panel:",
      "Reduces neutral current and makes better use of capacity",
      "Doubles the supply voltage",
      "Trips the main breaker",
      "Is prohibited by code",
    ),
    q(
      "A splitter is used to:",
      "Divide large supply conductors among several disconnects",
      "Join communication cables",
      "Support luminaires",
      "Store spare fuses",
    ),
    q(
      "In this context, low voltage distribution generally means systems operating at:",
      "750 V or less",
      "Over 5,000 V",
      "Only 12 V",
      "Exactly 347 V",
    ),
  ],

  // L — Install and Maintain Bonding, Grounding and Ground Fault Detection
  L: [
    q(
      "The purpose of system grounding is to:",
      "Stabilize voltage to earth and provide a path for fault current",
      "Increase circuit resistance",
      "Reduce the amount of wire needed",
      "Make lamps burn brighter",
    ),
    q(
      "Bonding ensures that:",
      "Exposed conductive parts stay at the same potential",
      "Circuits switch faster",
      "Meters read lower",
      "Breakers never trip",
    ),
    q(
      "An acceptable grounding electrode includes:",
      "Ground rods or a concrete-encased electrode installed to code",
      "Any painted metal surface",
      "A plastic water pipe",
      "A wooden stake",
    ),
    q(
      "During a ground fault, a low-impedance bonding path allows:",
      "Enough current to flow to operate the overcurrent device quickly",
      "The fault to continue indefinitely",
      "The voltage to rise on purpose",
      "The neutral to disconnect",
    ),
    q(
      "Ground fault detection on ungrounded systems is used to:",
      "Indicate the first fault before a second one causes an outage",
      "Measure energy consumption",
      "Improve the power factor",
      "Calibrate the utility meter",
    ),
  ],

  // Q — Install and Maintain Raceways, Cables and Enclosures
  Q: [
    q(
      "The total of all bends in a conduit run between pull points must not exceed:",
      "360 degrees",
      "90 degrees",
      "540 degrees",
      "There is no limit",
    ),
    q(
      "Conduit fill limits exist to:",
      "Prevent conductor damage and overheating during pulling and operation",
      "Save on couplings",
      "Make runs look uniform",
      "Speed up inspections",
    ),
    q(
      "NMD90 cable is typically used for:",
      "Dry indoor residential wiring",
      "Direct burial underground",
      "High-temperature oven interiors",
      "Overhead service drops",
    ),
    q(
      "A box connector's job is to:",
      "Secure the cable and protect it where it enters the box",
      "Colour-code the circuit",
      "Insulate the conductors",
      "Hold the cover plate on",
    ),
    q(
      "EMT is joined and terminated using:",
      "Set-screw or compression fittings",
      "Solder joints",
      "Adhesive tape",
      "Twist-on wire connectors",
    ),
  ],

  // R — Install and Maintain Branch Circuitry
  R: [
    q(
      "A typical 15 A residential branch circuit uses:",
      "14 AWG copper conductors",
      "8 AWG copper conductors",
      "18 AWG copper conductors",
      "6 AWG aluminum conductors",
    ),
    q(
      "Three-way switches allow:",
      "Control of one load from two locations",
      "Three lights on one switch only",
      "Dimming without a dimmer",
      "Automatic scheduling",
    ),
    q(
      "The CEC limits a typical 15 A residential circuit to a maximum of:",
      "12 outlets",
      "2 outlets",
      "30 outlets",
      "An unlimited number",
    ),
    q(
      "On a receptacle, the brass-coloured terminal connects to:",
      "The ungrounded (live) conductor",
      "The neutral conductor",
      "The bonding conductor",
      "Nothing — it is decorative",
    ),
    q(
      "Wiring a light controlled from two hallway ends requires:",
      "Two 3-way switches with travellers between them",
      "Two single-pole switches in series",
      "A dimmer and a relay",
      "A split receptacle",
    ),
  ],

  // V — Install and Maintain Motor Starters and Controls
  V: [
    q(
      "A magnetic starter combines:",
      "A contactor with an overload relay",
      "Two toggle switches",
      "A fuse and a pilot lamp",
      "A meter and a timer",
    ),
    q(
      "Motor overload relays protect against:",
      "Sustained excess current that would overheat the motor",
      "Short circuits only",
      "Low ambient temperature",
      "Radio interference",
    ),
    q(
      "In a three-wire start/stop control circuit, the seal-in contact:",
      "Keeps the coil energized after the start button is released",
      "Stops the motor instantly",
      "Reverses the rotation",
      "Trips the overloads",
    ),
    q(
      "Jogging (inching) a motor means:",
      "Energizing it momentarily for small movements",
      "Running it at full speed continuously",
      "Reversing its polarity",
      "Disconnecting its load",
    ),
    q(
      "A control transformer supplies:",
      "A lower voltage for the control circuit",
      "Power back to the utility",
      "Heat for the enclosure",
      "Battery charging current",
    ),
  ],
};

// generic fallback for ids outside the line banks
const GENERAL_BANK: QuizQuestion[] = [
  q(
    "What is the main purpose of tracking competencies in an apprenticeship?",
    "To record progress toward certification",
    "To decorate the dashboard",
    "To replace on-the-job training",
    "To skip required work hours",
  ),
  q(
    "Before starting a hands-on task, what should you do first?",
    "Review the relevant safety procedures",
    "Ignore the manual",
    "Remove all guards from the equipment",
    "Wait for the shift to end",
  ),
  q(
    "Which document typically records the hours worked toward a trade certification?",
    "A logbook",
    "A grocery receipt",
    "A boarding pass",
    "A warranty card",
  ),
  q(
    "What does 'Red Seal' certification signify in the skilled trades?",
    "Interprovincial recognition of a qualified tradesperson",
    "A limited-time discount",
    "A type of adhesive",
    "An entry-level orientation badge",
  ),
  q(
    "Why is it useful to break a large skill into smaller competencies?",
    "It makes progress measurable and less overwhelming",
    "It hides how much work is left",
    "It removes the need for practice",
    "It guarantees a passing grade",
  ),
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const withShuffledOptions = (questions: QuizQuestion[]): QuizQuestion[] =>
  questions.map((item) => ({ ...item, options: shuffle(item.options) }));

export async function generateQuiz(
  skillId: string,
  _content: string,
  _apiKey: string,
): Promise<QuizQuestion[]> {
  // simulate generation latency so the existing loading UI is exercised
  await new Promise((resolve) => setTimeout(resolve, 900));

  // the level exam samples one question from five different lines
  if (skillId === "EXAM") {
    const lines = shuffle(Object.keys(LINE_BANKS)).slice(0, 5);
    return withShuffledOptions(
      lines.map((line) => shuffle(LINE_BANKS[line])[0]),
    );
  }

  const bank = LINE_BANKS[skillId?.[0]?.toUpperCase() ?? ""] ?? GENERAL_BANK;
  return withShuffledOptions(bank);
}
