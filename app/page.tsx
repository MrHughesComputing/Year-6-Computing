"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  deleteCloudPupilData,
  loadCloudProfileData,
  saveCloudLessonProgress,
  saveCloudProfile,
} from "@/lib/cloudProgress";

type TermName = "Summer Term 1" | "Summer Term 2";
type PlatformName = "Scratch" | "MakeCode";

type Lesson = {
  id: number;
  week: number;
  term: TermName;
  platform: PlatformName;
  title: string;
  shortTitle: string;
  description: string;
  objective: string;
  overview: string;
  whyItMatters: string;
  retrievalQuestion: string;
  teachingPoints: string[];
  vocab: string[];
  guidedSteps: string[];
  practiceTask: string;
  challengeTask: string;
  keyQuestion: string;
  misconception: string;
  correctOutcome: string;
  wrongOutcome: string;
  projectLink: string;
};

type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
};

type QuizQuestionView = QuizQuestion & {
  originalOptionIndexes: number[];
};

type QuizResult = {
  submitted: boolean;
  score: number;
  answers: number[];
};

type ScreenshotMap = Record<number, string>;
type QuizOrderMap = Record<number, number[][]>;

type LearnerProfile = {
  className: string;
  studentName: string;
  storageKey: string;
  accessCode?: string;
};

type PupilExport = {
  app: "year6-computing";
  version: 1;
  exportedAt: string;
  profile: LearnerProfile;
  completedLessonIds: number[];
  quizResults: Record<number, QuizResult>;
  quizOrder: QuizOrderMap;
  screenshots: ScreenshotMap;
};

type StartMode = "existing" | "new";

const CLASS_OPTIONS = ["Year 6 Elder", "Year 6 Juniper", "Year 6 Walnut"];

const REGISTRY_KEY = "year6-pupil-registry";
const CURRENT_PROFILE_KEY = "year6-current-profile";

const pastel = {
  page: "#f8fafc",
  text: "#334155",
  title: "#1e293b",
  panel: "#ffffff",
  panelSoft: "#fdf2f8",
  panelBlue: "#eff6ff",
  panelMint: "#ecfeff",
  panelLilac: "#f5f3ff",
  panelPeach: "#fff7ed",
  panelSky: "#f0f9ff",
  border: "#dbe4f0",
  accent: "#7c3aed",
  accentSoft: "#ede9fe",
  navy: "#334155",
  green: "#10b981",
  greenSoft: "#d1fae5",
  amber: "#f59e0b",
  amberSoft: "#fef3c7",
  rose: "#f43f5e",
  roseSoft: "#fff1f2",
  blueSoft: "#dbeafe",
  slateSoft: "#f8fafc",
  shadow: "0 10px 30px rgba(148, 163, 184, 0.14)",
};

const lessons: Lesson[] = [
  {
    id: 1,
    week: 1,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Variables in Games",
    shortTitle: "What is a Variable?",
    description: "Introducing variables as values that can change during a game.",
    objective: "I can explain that a variable stores information that can change.",
    overview:
      "A variable is like a labelled box in a program. It holds a value such as score, health, lives, or time, and that value can change while the project runs.",
    whyItMatters:
      "Games and interactive programs need to keep track of changing information. Variables make that possible.",
    retrievalQuestion:
      "Before this lesson: what kinds of information change while you are playing a game?",
    teachingPoints: [
      "A variable stores data with a label.",
      "The value inside a variable can increase, decrease, or be reset.",
      "Common game variables include score, timer, lives, health, and level.",
      "A variable is not just for maths; it is for tracking change.",
    ],
    vocab: ["variable", "value", "store", "data", "score", "lives"],
    guidedSteps: [
      "Open Scratch and create a new project.",
      "Delete the cat only if you want a different sprite.",
      "Go to Variables and choose Make a Variable.",
      "Create a variable called score.",
      "Tick the checkbox so the score appears on the stage.",
      "Add when green flag clicked.",
      "Set score to 0 at the start.",
      "Add change score by 1 and test how the value changes.",
    ],
    practiceTask:
      "Create a variable called score and make it start at 0 when the green flag is clicked.",
    challengeTask:
      "Add a second variable called lives and decide how both variables should be used in a simple game idea.",
    keyQuestion: "Why is a variable useful in a game project?",
    misconception:
      "A variable is not a fixed piece of text. It stores a value that can change while the program runs.",
    correctOutcome:
      "The project shows a score variable that starts correctly and changes when the code runs.",
    wrongOutcome:
      "The variable is created, but it is not set or changed clearly, so the value does not help the program.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 2,
    week: 2,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Setting and Changing Variables",
    shortTitle: "Set vs Change",
    description: "Understanding the difference between setting a value and changing a value.",
    objective: "I can use set and change blocks correctly with a variable.",
    overview:
      "Setting a variable gives it an exact starting value. Changing a variable adds or subtracts from its current value.",
    whyItMatters:
      "If pupils confuse set and change, scores, timers, and counters will not behave properly.",
    retrievalQuestion:
      "What was the name of the variable you created last lesson, and what did it track?",
    teachingPoints: [
      "Set gives the variable a precise value such as 0.",
      "Change adjusts the current value such as +1 or -1.",
      "Set is useful at the start of a game.",
      "Change is useful during the game while events happen.",
    ],
    vocab: ["set", "change", "counter", "start value", "increase", "decrease"],
    guidedSteps: [
      "Open your Scratch project from last lesson or make a new one.",
      "Create a variable called points.",
      "Add when green flag clicked.",
      "Use set points to 0.",
      "Add another event such as when this sprite clicked.",
      "Use change points by 1.",
      "Test the project by clicking the sprite.",
      "Now add another block that changes points by -1 and compare the effect.",
    ],
    practiceTask:
      "Build a mini counter where clicking a sprite increases a variable by 1.",
    challengeTask:
      "Create a project with two buttons: one increases points and one decreases points.",
    keyQuestion: "When should a programmer use set instead of change?",
    misconception:
      "Set and change do not do the same job. Set replaces the value; change adjusts the current value.",
    correctOutcome:
      "The variable starts at the correct value and then changes logically during the project.",
    wrongOutcome:
      "The variable keeps resetting when it should be increasing, or keeps increasing when it should restart.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 3,
    week: 3,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Using a Variable for Score",
    shortTitle: "Score System",
    description: "Applying variables in a simple scoring game.",
    objective: "I can use a variable to track score in a game.",
    overview:
      "A score system rewards actions. Scratch can add to a score whenever a player completes a successful action.",
    whyItMatters:
      "This is one of the clearest real uses of variables in game design.",
    retrievalQuestion:
      "What is the difference between setting a variable and changing a variable?",
    teachingPoints: [
      "The score must be reset at the start.",
      "The score should increase only when the correct event happens.",
      "The event might be touching an object, clicking a sprite, or collecting an item.",
      "The code should avoid accidental double-counting where possible.",
    ],
    vocab: ["score", "event", "collect", "reward", "collision", "reset"],
    guidedSteps: [
      "Create a variable called score if you do not already have one.",
      "Set score to 0 when the green flag is clicked.",
      "Choose a sprite to collect.",
      "Add code that checks for a successful event, such as touching another sprite.",
      "When the event happens, change score by 1.",
      "Move or hide the collected item so the score does not increase endlessly from one touch.",
      "Test the game several times.",
      "Watch how the score changes as events happen.",
    ],
    practiceTask:
      "Make a simple game where score increases when the player collects or clicks something correctly.",
    challengeTask:
      "Add a target score and a winning message when the score reaches it.",
    keyQuestion: "How does a score variable make a game feel more interactive?",
    misconception:
      "A score should not increase all the time. It should only change when the intended event happens.",
    correctOutcome:
      "The score starts at 0 and increases only when the correct game action takes place.",
    wrongOutcome:
      "The score increases too often, never resets, or does not match the player’s actions.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 4,
    week: 4,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Using a Variable for Lives",
    shortTitle: "Lives and Health",
    description: "Tracking mistakes or damage using a variable.",
    objective: "I can use a variable to reduce lives when something goes wrong.",
    overview:
      "A lives variable makes a game more meaningful because it can measure mistakes, damage, or missed chances.",
    whyItMatters:
      "Variables are not only for rewards. They can also track risk, challenge, and game over states.",
    retrievalQuestion:
      "In your own words, how is a lives variable different from a score variable?",
    teachingPoints: [
      "Lives usually begin at a set number such as 3.",
      "Lives should decrease only when the player makes a mistake or meets danger.",
      "If lives reach 0, the game may stop or show a message.",
      "Variables help control game flow, not just display numbers.",
    ],
    vocab: ["lives", "health", "penalty", "game over", "decrease", "condition"],
    guidedSteps: [
      "Create a variable called lives.",
      "Set lives to 3 when the green flag is clicked.",
      "Choose an event that counts as a mistake, such as touching an enemy.",
      "When that event happens, change lives by -1.",
      "Add a check to see whether lives = 0.",
      "If lives = 0, make the sprite say Game Over or stop the project.",
      "Test what happens after one, two, and three mistakes.",
      "Check that lives never start with the wrong value.",
    ],
    practiceTask:
      "Add a lives system to a simple game and reduce lives when the player touches danger.",
    challengeTask:
      "Use both score and lives in the same project and decide which one matters most to winning.",
    keyQuestion: "Why does a lives variable change the way a player behaves in a game?",
    misconception:
      "Lives should not decrease randomly. They must be linked to a clear event or rule in the code.",
    correctOutcome:
      "Lives start correctly, decrease when danger is touched, and trigger a game over when they reach 0.",
    wrongOutcome:
      "Lives fall too fast, never decrease, or the game over state does not connect to the variable.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 5,
    week: 5,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Variables with Conditions",
    shortTitle: "If + Variables",
    description: "Using variables inside decision-making code.",
    objective: "I can use a variable in an if statement to control what happens next.",
    overview:
      "A variable becomes more powerful when the program uses its value to make decisions. For example, if score = 10, the player wins.",
    whyItMatters:
      "This is where tracking data connects to computational thinking and logic.",
    retrievalQuestion:
      "What does a condition do, and how could it work with a score or lives variable?",
    teachingPoints: [
      "Conditions ask true/false questions.",
      "Variables can be compared using =, >, and <.",
      "This allows the project to respond differently depending on the value.",
      "Game win and lose states often depend on variable conditions.",
    ],
    vocab: ["condition", "compare", "greater than", "equal to", "logic", "state"],
    guidedSteps: [
      "Open a project with a variable such as score or lives.",
      "Add a condition such as if score = 5 then.",
      "Place an action inside the if block, such as say You win.",
      "Try a second version using if lives < 1 then.",
      "Change the variable during the game so the condition can become true.",
      "Test whether the message appears at the correct time.",
      "Adjust the compared value if needed.",
      "Retest carefully.",
    ],
    practiceTask:
      "Use a variable inside an if statement to trigger a win or lose message.",
    challengeTask:
      "Create two different conditions in the same project, one for winning and one for losing.",
    keyQuestion: "Why does comparing a variable help a program make decisions?",
    misconception:
      "A variable on its own does not create a decision. The program must compare its value in a condition.",
    correctOutcome:
      "The project reacts only when the variable reaches the intended value.",
    wrongOutcome:
      "The project reacts too early, too late, or not at all because the condition is incorrect.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 6,
    week: 6,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Designing a Variable-Based Game",
    shortTitle: "Plan Before Code",
    description: "Planning how variables, events, and conditions will work together.",
    objective: "I can plan a game that uses variables clearly before building it.",
    overview:
      "Good programs are planned. Pupils should decide what to track, how values change, and what conditions matter before building everything.",
    whyItMatters:
      "Planning prevents messy code and helps pupils think like programmers rather than random block collectors.",
    retrievalQuestion:
      "What is one good reason to use both variables and conditions in a project?",
    teachingPoints: [
      "A game plan should include goal, rules, variables, and win/lose conditions.",
      "Different variables do different jobs.",
      "The order of events matters.",
      "A clear algorithm makes the build easier.",
    ],
    vocab: ["algorithm", "plan", "flow", "rule", "goal", "sequence"],
    guidedSteps: [
      "Choose a simple game idea.",
      "Write down the player goal.",
      "Decide which variable or variables the game needs.",
      "Decide when each variable changes.",
      "Write a win condition and a lose condition.",
      "Sketch the order of events from start to finish.",
      "Match your plan to Scratch blocks you expect to use.",
      "Only after planning, begin building.",
    ],
    practiceTask:
      "Create a clear plan for a game that uses at least one variable and one condition.",
    challengeTask:
      "Plan a game that uses two variables and explain how both affect the outcome.",
    keyQuestion: "Why is planning especially important once a project has more than one variable?",
    misconception:
      "Planning is not extra work to avoid. It is part of programming well.",
    correctOutcome:
      "The pupil can explain what each variable does and how the project should behave before coding.",
    wrongOutcome:
      "The project idea exists, but the rules, values, and conditions are unclear or contradictory.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 7,
    week: 7,
    term: "Summer Term 1",
    platform: "Scratch",
    title: "Debugging Variables",
    shortTitle: "Fix the Logic",
    description: "Testing and fixing projects that use score, lives, and conditions.",
    objective: "I can spot and fix mistakes in code that uses variables.",
    overview:
      "Variable bugs often look like wrong scores, endless counting, or a game over appearing too early. Debugging means testing methodically and fixing the real cause.",
    whyItMatters:
      "Programming is not just writing code. It is also checking whether the code behaves as intended.",
    retrievalQuestion:
      "What is one common mistake that could make a score variable behave incorrectly?",
    teachingPoints: [
      "Start by identifying exactly what is wrong.",
      "Test one part at a time.",
      "Check start values, change values, and conditions.",
      "Do not change everything at once.",
    ],
    vocab: ["debug", "test", "logic error", "trace", "fix", "behaviour"],
    guidedSteps: [
      "Run the project and observe carefully.",
      "Check whether the variable starts with the correct value.",
      "Trigger the event that should change the variable.",
      "Notice whether the value changes by the correct amount.",
      "Check any if statements that compare the variable.",
      "Change one piece of code only.",
      "Retest after the change.",
      "Repeat until the project behaves as planned.",
    ],
    practiceTask:
      "Test a variable-based game and fix at least one bug affecting score, lives, or win/lose logic.",
    challengeTask:
      "Intentionally create a bug, swap projects with a partner, and explain how to debug it logically.",
    keyQuestion: "Why should a programmer change only one thing at a time while debugging?",
    misconception:
      "Debugging is not guessing. It is careful testing, identifying the cause, and making a controlled fix.",
    correctOutcome:
      "The variable system behaves reliably because the pupil tested and fixed the real problem.",
    wrongOutcome:
      "The code changes repeatedly without a clear reason, so the bug stays hidden or new bugs appear.",
    projectLink: "https://scratch.mit.edu/",
  },
  {
    id: 8,
    week: 1,
    term: "Summer Term 2",
    platform: "MakeCode",
    title: "Introduction to Micro:bit",
    shortTitle: "Input → Process → Output",
    description: "Beginning MakeCode and understanding how a physical device responds to code.",
    objective: "I can explain input, process, and output on a micro:bit.",
    overview:
      "The micro:bit is a physical computing device. It can receive input, process instructions, and produce output such as lights or text.",
    whyItMatters:
      "This moves programming beyond the screen and helps pupils understand real-world devices.",
    retrievalQuestion:
      "Can you name one device in everyday life that uses input, processing, and output?",
    teachingPoints: [
      "Input is what the device detects or receives.",
      "Processing is the code making a decision.",
      "Output is what the device does in response.",
      "The emulator helps pupils test code before using a real device.",
    ],
    vocab: ["input", "process", "output", "device", "emulator", "LED"],
    guidedSteps: [
      "Open Microsoft MakeCode for micro:bit.",
      "Start a new project.",
      "Find the on start block.",
      "Add a basic show leds block.",
      "Create a simple LED pattern such as a heart or smile.",
      "Run the code in the emulator.",
      "Change the pattern and test again.",
      "Discuss what the input, process, and output are in this example.",
    ],
    practiceTask:
      "Create a MakeCode project that shows a clear LED pattern when the program starts.",
    challengeTask:
      "Make the micro:bit show two different LED patterns in sequence and explain the output clearly.",
    keyQuestion: "How is programming a micro:bit different from programming only on the screen?",
    misconception:
      "The micro:bit is not magic hardware. It still follows precise instructions written by the programmer.",
    correctOutcome:
      "The project runs in the emulator and the pupil can explain the output produced by the code.",
    wrongOutcome:
      "The pupil places blocks randomly without understanding what the device is supposed to do.",
    projectLink: "https://makecode.microbit.org/",
  },
  {
    id: 9,
    week: 2,
    term: "Summer Term 2",
    platform: "MakeCode",
    title: "Selection and Flow in MakeCode",
    shortTitle: "If... Then... Else",
    description: "Using conditions to control what a micro:bit does.",
    objective: "I can use if... then... else to control program flow in MakeCode.",
    overview:
      "A micro:bit can make decisions using conditional logic. For example, if button A is pressed then show one pattern, else show another.",
    whyItMatters:
      "Selection is essential for building responsive devices rather than one fixed display.",
    retrievalQuestion:
      "What does a condition do in code, and where have you used one before?",
    teachingPoints: [
      "Selection controls flow.",
      "The program checks whether a condition is true or false.",
      "The then path runs when true.",
      "The else path runs when false.",
    ],
    vocab: ["selection", "condition", "flow", "true", "false", "branch"],
    guidedSteps: [
      "Open a new MakeCode project.",
      "Find an input block such as button A pressed.",
      "Add an if then else block.",
      "Use a condition related to a button or input.",
      "Place one output in the then branch.",
      "Place a different output in the else branch.",
      "Test the project in the emulator.",
      "Change the condition or output and compare the results.",
    ],
    practiceTask:
      "Build a project where the micro:bit shows one output for one condition and a different output otherwise.",
    challengeTask:
      "Add a second decision so the micro:bit can respond in more than one way to user input.",
    keyQuestion: "Why is an else path useful when controlling a device?",
    misconception:
      "Else is not extra decoration. It handles what should happen when the condition is false.",
    correctOutcome:
      "The device responds differently depending on whether the condition is met.",
    wrongOutcome:
      "The same output appears every time because the program is not branching correctly.",
    projectLink: "https://makecode.microbit.org/",
  },
  {
    id: 10,
    week: 3,
    term: "Summer Term 2",
    platform: "MakeCode",
    title: "Sensing Inputs",
    shortTitle: "Buttons and Motion",
    description: "Using button presses and movement as inputs for a program.",
    objective: "I can use inputs such as buttons and motion to control a micro:bit.",
    overview:
      "The micro:bit includes built-in inputs such as buttons and an accelerometer. These allow the device to react to human actions and movement.",
    whyItMatters:
      "Sensing makes physical computing interactive and responsive.",
    retrievalQuestion:
      "What is the difference between input and output in a physical device?",
    teachingPoints: [
      "Buttons are simple digital inputs.",
      "Motion can be detected through the accelerometer.",
      "The program responds only when a chosen trigger happens.",
      "Different inputs can produce different outputs.",
    ],
    vocab: ["sensor", "trigger", "input", "button", "accelerometer", "motion"],
    guidedSteps: [
      "Start a new MakeCode project.",
      "Use on button A pressed and add an LED output.",
      "Test the button response in the emulator.",
      "Now add an input gesture such as shake.",
      "Give the shake gesture a different output.",
      "Test both inputs separately.",
      "Check that each input causes the correct output.",
      "Explain how the device knows which event happened.",
    ],
    practiceTask:
      "Create a micro:bit project that responds to both a button press and a movement gesture.",
    challengeTask:
      "Combine two different inputs in one project and make the outputs clearly different.",
    keyQuestion: "Why are sensors important in physical computing?",
    misconception:
      "The micro:bit does not guess. It only reacts when the programmed input condition is triggered.",
    correctOutcome:
      "The device responds correctly to more than one type of input.",
    wrongOutcome:
      "The device always shows the same output because the inputs are not linked properly.",
    projectLink: "https://makecode.microbit.org/",
  },
  {
    id: 11,
    week: 4,
    term: "Summer Term 2",
    platform: "MakeCode",
    title: "Variables and Logic in MakeCode",
    shortTitle: "Count and Compare",
    description: "Using variables with movement and conditions on a micro:bit.",
    objective: "I can create a variable in MakeCode and use it in a condition.",
    overview:
      "Variables in MakeCode can track changing values in a physical device, such as the number of shakes or steps. Conditions can then compare that value to decide what happens next.",
    whyItMatters:
      "This joins the Year 6 ideas together: changing values, logic, and real-world input.",
    retrievalQuestion:
      "How could a micro:bit use a variable in the same way that a Scratch game uses score?",
    teachingPoints: [
      "Variables can count physical events such as button presses or movements.",
      "A condition can compare the variable to a target value.",
      "The output can change when the target is reached.",
      "This is the foundation of a step counter.",
    ],
    vocab: ["variable", "value", "compare", "count", "target", "logic"],
    guidedSteps: [
      "Open a new MakeCode project.",
      "Create a variable called steps or count.",
      "Set the variable to 0 when the program starts.",
      "Use an input such as shake to change the variable by 1.",
      "Add a condition such as if steps > 9 then.",
      "Place an output inside the condition, such as show number or show icon.",
      "Test the project in the emulator.",
      "Watch how the variable changes and when the output happens.",
    ],
    practiceTask:
      "Build a project that counts an input and responds when the value reaches a chosen target.",
    challengeTask:
      "Use two conditions with the same variable, such as one output at 5 and another at 10.",
    keyQuestion: "Why is a variable especially useful in a physical device that senses movement?",
    misconception:
      "The sensor detects the event, but the variable tracks how many times it has happened.",
    correctOutcome:
      "The micro:bit counts physical input and changes its behaviour based on the variable value.",
    wrongOutcome:
      "The project senses the input, but it does not store or compare the count correctly.",
    projectLink: "https://makecode.microbit.org/",
  },
  {
    id: 12,
    week: 5,
    term: "Summer Term 2",
    platform: "MakeCode",
    title: "Designing a Step Counter",
    shortTitle: "Final Design",
    description: "Planning a simple micro:bit step counter using input, variables, and output.",
    objective: "I can design a step counter algorithm using variables and sensing.",
    overview:
      "A step counter needs an input, a variable to track count, and an output to tell the user the result. The program must be planned carefully so each part works together.",
    whyItMatters:
      "This is the final Year 6 application of variables and sensing in a purposeful real-world project.",
    retrievalQuestion:
      "Which three parts must every step counter have: input, variable, and what else?",
    teachingPoints: [
      "The design should identify the input clearly.",
      "The variable tracks the count.",
      "The output tells the user the result or progress.",
      "Good design makes implementation easier and debugging faster.",
    ],
    vocab: ["algorithm", "design", "step counter", "input", "output", "system"],
    guidedSteps: [
      "Decide which input will count as a step, such as shake or movement.",
      "Create a variable name such as steps.",
      "Decide how the steps variable changes.",
      "Choose how the device will show progress or final output.",
      "Write a simple if condition that uses the variable.",
      "Plan what happens at the start of the program.",
      "Plan what happens each time movement is detected.",
      "Review whether the input, variable, and output all connect logically.",
    ],
    practiceTask:
      "Plan a clear step counter algorithm showing input, variable changes, and output.",
    challengeTask:
      "Extend the design so the counter resets, celebrates a target number, or responds differently at different milestones.",
    keyQuestion: "Why is planning important before building a device such as a step counter?",
    misconception:
      "A working device still needs a clear design. Planning is part of strong programming, not separate from it.",
    correctOutcome:
      "The pupil can explain how the step counter should work from start to finish before building it.",
    wrongOutcome:
      "The pupil has an idea but cannot explain how the input, variable, and output work together.",
    projectLink: "https://makecode.microbit.org/",
  },
];

const quizBank: Record<number, QuizQuestion[]> = {
  1: [
    {
      prompt: "What is a variable in programming?",
      options: [
        "A named place that stores a value",
        "A type of sprite costume",
        "A sound effect",
        "A backdrop tool",
      ],
      answer: 0,
    },
    {
      prompt: "Which is the best example of a game variable?",
      options: ["score", "stage colour", "sprite costume design", "pen colour only"],
      answer: 0,
    },
    {
      prompt: "Why are variables useful in games?",
      options: [
        "They track values that change while the game runs",
        "They make sprites larger automatically",
        "They stop all bugs",
        "They replace all events",
      ],
      answer: 0,
    },
    {
      prompt: "Which value is most likely to change during play?",
      options: ["lives", "project title", "teacher name", "computer brand"],
      answer: 0,
    },
    {
      prompt: "What should a pupil understand about a variable?",
      options: [
        "It stores information that can change",
        "It is always fixed forever",
        "It only stores pictures",
        "It only works in maths projects",
      ],
      answer: 0,
    },
    {
      prompt: "Which of these is not usually tracked by a variable in a game?",
      options: ["the classroom door", "score", "timer", "health"],
      answer: 0,
    },
    {
      prompt: "If a game needs to remember points, what should it use?",
      options: ["a variable", "a backdrop", "a costume", "a pen stamp"],
      answer: 0,
    },
    {
      prompt: "Which statement is true?",
      options: [
        "Variables can increase, decrease, or reset",
        "Variables are only for decoration",
        "Variables cannot change once made",
        "Variables are the same as sounds",
      ],
      answer: 0,
    },
    {
      prompt: "Which word best matches what a variable does?",
      options: ["stores", "draws", "hides", "deletes"],
      answer: 0,
    },
    {
      prompt: "In a racing game, which variable would make most sense?",
      options: ["lap count", "screen brightness", "desk number", "project thumbnail"],
      answer: 0,
    },
  ],
  2: [
    {
      prompt: "What does set score to 0 do?",
      options: [
        "Gives score an exact value",
        "Adds 0 forever",
        "Deletes the variable",
        "Makes the variable invisible only",
      ],
      answer: 0,
    },
    {
      prompt: "What does change score by 1 do?",
      options: [
        "Adds 1 to the current value",
        "Always returns the score to 1",
        "Creates a new variable",
        "Stops the game",
      ],
      answer: 0,
    },
    {
      prompt: "When is set usually most useful?",
      options: [
        "At the start of a game",
        "When drawing a backdrop",
        "When renaming a sprite only",
        "When exporting a file",
      ],
      answer: 0,
    },
    {
      prompt: "When is change usually most useful?",
      options: [
        "When the value needs to go up or down during play",
        "When the project is closed",
        "When the sprite is chosen",
        "When a background is imported",
      ],
      answer: 0,
    },
    {
      prompt: "A pupil wants points to begin at zero every time. Which block is best?",
      options: ["set points to 0", "change points by 0", "hide variable", "show variable"],
      answer: 0,
    },
    {
      prompt: "What is the main difference between set and change?",
      options: [
        "Set replaces the value, change adjusts it",
        "Set and change always do exactly the same job",
        "Set is for sound and change is for movement",
        "Set deletes and change saves",
      ],
      answer: 0,
    },
    {
      prompt: "If a score should go down by 1, which block is most suitable?",
      options: ["change score by -1", "set score to -1", "show score", "make a variable"],
      answer: 0,
    },
    {
      prompt: "What problem happens if a score is set to 0 every time a sprite is clicked?",
      options: [
        "The score keeps resetting instead of building up",
        "The score becomes invisible only",
        "The sprite disappears",
        "The project cannot save",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement shows correct variable thinking?",
      options: [
        "Set gives a start point and change updates from there",
        "Set should always replace change",
        "Change should always replace set",
        "Variables never need start values",
      ],
      answer: 0,
    },
    {
      prompt: "A counter that rises with every click mostly needs which block during the game?",
      options: ["change", "set only", "hide", "broadcast only"],
      answer: 0,
    },
  ],
  3: [
    {
      prompt: "What should a score variable usually do at the start of a game?",
      options: ["start at 0", "start at 100 automatically", "hide forever", "delete itself"],
      answer: 0,
    },
    {
      prompt: "When should a score increase?",
      options: [
        "When the correct event happens",
        "All the time",
        "Only when the green flag is clicked",
        "When the project closes",
      ],
      answer: 0,
    },
    {
      prompt: "Which is a good event for increasing score?",
      options: [
        "Collecting an object",
        "Changing the desktop wallpaper",
        "Opening Scratch",
        "Typing the project title",
      ],
      answer: 0,
    },
    {
      prompt: "Why might a score rise too quickly by mistake?",
      options: [
        "The same event is being counted repeatedly",
        "The variable is named clearly",
        "The score started at zero",
        "The project was tested",
      ],
      answer: 0,
    },
    {
      prompt: "What is the best reason to use a score system?",
      options: [
        "It tracks success in the game",
        "It replaces the player",
        "It makes code impossible to debug",
        "It removes the need for events",
      ],
      answer: 0,
    },
    {
      prompt: "If a sprite is collected once, what should often happen next?",
      options: [
        "It should move or hide so it is not counted endlessly",
        "Nothing at all",
        "The project should shut down",
        "The score should reset immediately",
      ],
      answer: 0,
    },
    {
      prompt: "What is a target score?",
      options: [
        "A value the player aims to reach",
        "The colour of the score monitor",
        "A type of costume",
        "A sound effect",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement is strongest?",
      options: [
        "A score variable should match the player’s successful actions",
        "A score should rise randomly to keep the game interesting",
        "A score should never change after the start",
        "A score is only for advanced adult programmers",
      ],
      answer: 0,
    },
    {
      prompt: "What would make a score system feel unfair?",
      options: [
        "Points appear without the player doing the right action",
        "The score starts at zero",
        "The game shows the score clearly",
        "The code uses events",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main idea of this lesson?",
      options: [
        "Using a variable to track score in a game",
        "Drawing a new background",
        "Adding many costumes",
        "Creating text boxes only",
      ],
      answer: 0,
    },
  ],
  4: [
    {
      prompt: "What does a lives variable usually track?",
      options: [
        "How many chances the player has left",
        "The number of backdrops",
        "The sound volume",
        "The name of the player",
      ],
      answer: 0,
    },
    {
      prompt: "What is a sensible start value for lives in a simple game?",
      options: ["3", "undefined forever", "1000 always", "no value at all"],
      answer: 0,
    },
    {
      prompt: "When should lives decrease?",
      options: [
        "When the player makes a mistake or hits danger",
        "Whenever the mouse moves",
        "At random",
        "Only when the program opens",
      ],
      answer: 0,
    },
    {
      prompt: "Which block would often reduce lives by one?",
      options: ["change lives by -1", "set lives to 100", "hide lives", "make a list"],
      answer: 0,
    },
    {
      prompt: "What should often happen when lives reach 0?",
      options: [
        "The game should end or show a lose message",
        "The score should become a backdrop",
        "The keyboard should lock",
        "The variable should become a sound",
      ],
      answer: 0,
    },
    {
      prompt: "How is lives different from score?",
      options: [
        "Lives often measure mistakes, while score often measures success",
        "Lives and score always mean exactly the same thing",
        "Lives cannot be variables",
        "Score cannot be used in games",
      ],
      answer: 0,
    },
    {
      prompt: "What would be poor design for a lives system?",
      options: [
        "Lives drop without any clear event causing it",
        "Lives begin at a chosen start value",
        "Lives reduce after touching danger",
        "Lives are checked with a condition",
      ],
      answer: 0,
    },
    {
      prompt: "Why do lives increase challenge in a game?",
      options: [
        "They make mistakes matter",
        "They remove all rules",
        "They stop the player from learning",
        "They replace all events",
      ],
      answer: 0,
    },
    {
      prompt: "Which condition is useful for a lives system?",
      options: ["if lives = 0", "if backdrop = blue", "if pen down", "if costume = 1 always"],
      answer: 0,
    },
    {
      prompt: "What is the lesson mainly about?",
      options: [
        "Using a variable to track mistakes or damage",
        "Designing a title screen only",
        "Recording voices",
        "Changing fonts",
      ],
      answer: 0,
    },
  ],
  5: [
    {
      prompt: "What does a condition do?",
      options: [
        "Checks whether something is true or false",
        "Draws a sprite",
        "Creates a new project automatically",
        "Deletes variables",
      ],
      answer: 0,
    },
    {
      prompt: "Which comparison could be used with a score variable?",
      options: ["score = 10", "show score", "make a variable", "say score"],
      answer: 0,
    },
    {
      prompt: "Why use a variable inside an if statement?",
      options: [
        "To make a decision based on the value",
        "To colour the stage",
        "To rename the sprite",
        "To avoid using logic",
      ],
      answer: 0,
    },
    {
      prompt: "What might happen if score = 10 is true?",
      options: [
        "The game could show a winning message",
        "The computer turns off",
        "All variables disappear",
        "The class changes automatically",
      ],
      answer: 0,
    },
    {
      prompt: "Which symbol means greater than?",
      options: [">", "=", "+", "/"],
      answer: 0,
    },
    {
      prompt: "What is needed before a variable can control game flow?",
      options: [
        "It must be compared in a condition",
        "It must be hidden forever",
        "It must be turned into text",
        "It must be deleted",
      ],
      answer: 0,
    },
    {
      prompt: "If lives < 1, what might that mean in a game?",
      options: [
        "The player has no lives left",
        "The score is increasing",
        "The sprite should move faster",
        "The game has no variables",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement is correct?",
      options: [
        "Variables and conditions work together to control outcomes",
        "Variables remove the need for all conditions",
        "Conditions cannot use variables",
        "A game can never use both score and logic",
      ],
      answer: 0,
    },
    {
      prompt: "What mistake should pupils avoid?",
      options: [
        "Thinking the variable alone makes the decision",
        "Testing their code",
        "Using a clear target value",
        "Resetting a score at the start",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main focus of this lesson?",
      options: [
        "Using variables inside decisions",
        "Changing costume colours",
        "Importing sounds only",
        "Creating a username screen",
      ],
      answer: 0,
    },
  ],
  6: [
    {
      prompt: "Why is planning a game important?",
      options: [
        "It helps the code stay logical and organised",
        "It makes coding unnecessary",
        "It removes all mistakes instantly",
        "It is only for teachers",
      ],
      answer: 0,
    },
    {
      prompt: "What should be planned before building?",
      options: [
        "Variables, rules, and win/lose conditions",
        "Only the sprite colour",
        "Only the classroom seating plan",
        "Only the computer password",
      ],
      answer: 0,
    },
    {
      prompt: "A game plan should explain what?",
      options: [
        "What the player is trying to do",
        "Which desk is nearest the wall",
        "How loud the room is",
        "What brand the monitor is",
      ],
      answer: 0,
    },
    {
      prompt: "What is an algorithm?",
      options: [
        "A sequence of steps for a process or program",
        "A kind of background image",
        "A sound effect",
        "A projector cable",
      ],
      answer: 0,
    },
    {
      prompt: "Why is planning even more important with two variables?",
      options: [
        "Because the logic becomes more complex",
        "Because two variables cannot be used together",
        "Because Scratch will block the project",
        "Because planning is only for maths",
      ],
      answer: 0,
    },
    {
      prompt: "What could a good plan include?",
      options: [
        "When the score rises and when lives fall",
        "Only the teacher name",
        "Only the colour theme",
        "Only how to log in",
      ],
      answer: 0,
    },
    {
      prompt: "What is poor planning likely to cause?",
      options: [
        "Confusing or messy code",
        "Automatic success",
        "Better debugging immediately",
        "Perfect logic without testing",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement best matches this lesson?",
      options: [
        "Good programmers think before they build",
        "Real programmers never plan",
        "Planning stops creativity completely",
        "Variables do not need rules",
      ],
      answer: 0,
    },
    {
      prompt: "A game idea has score but no lose state. What is missing?",
      options: ["Part of the design thinking", "A mouse", "A costume", "A list block"],
      answer: 0,
    },
    {
      prompt: "What is the main focus here?",
      options: [
        "Planning a variable-based game before coding",
        "Recording audio",
        "Making title art only",
        "Changing desktop settings",
      ],
      answer: 0,
    },
  ],
  7: [
    {
      prompt: "What does debugging mean?",
      options: [
        "Finding and fixing problems in code",
        "Making a project look pretty",
        "Deleting all variables",
        "Adding random blocks quickly",
      ],
      answer: 0,
    },
    {
      prompt: "What should a pupil check first in a broken variable system?",
      options: [
        "Whether the starting value and changes are correct",
        "The classroom temperature",
        "The stage colour only",
        "The font on the screen",
      ],
      answer: 0,
    },
    {
      prompt: "Why is it good to change one thing at a time?",
      options: [
        "So you know what caused the fix",
        "So the bug becomes harder to find",
        "So the project gets more random",
        "So testing is no longer needed",
      ],
      answer: 0,
    },
    {
      prompt: "Which is an example of a variable bug?",
      options: [
        "Score rises too many times from one event",
        "The desk is slightly untidy",
        "The pupil changed their seat",
        "The mouse pad moved",
      ],
      answer: 0,
    },
    {
      prompt: "If a winning message appears too early, what is worth checking?",
      options: [
        "The condition comparing the variable",
        "The school logo",
        "The laptop sticker",
        "The browser window size",
      ],
      answer: 0,
    },
    {
      prompt: "Which is the best debugging habit?",
      options: [
        "Test, observe, change one part, and retest",
        "Guess wildly and hope",
        "Delete everything immediately",
        "Never run the project",
      ],
      answer: 0,
    },
    {
      prompt: "What is a logic error?",
      options: [
        "The code runs but behaves incorrectly",
        "The screen is dusty",
        "The internet is fast",
        "The project has a title",
      ],
      answer: 0,
    },
    {
      prompt: "What mistake should pupils avoid during debugging?",
      options: [
        "Changing many things at once without understanding the cause",
        "Testing carefully",
        "Checking conditions",
        "Watching the variable value",
      ],
      answer: 0,
    },
    {
      prompt: "Why is debugging part of programming?",
      options: [
        "Because programs must be tested and improved",
        "Because code always works perfectly first time",
        "Because variables should never be used",
        "Because planning is not needed",
      ],
      answer: 0,
    },
    {
      prompt: "This lesson is mainly about:",
      options: [
        "Testing and fixing variable logic",
        "Creating fancy title screens only",
        "Choosing music tracks",
        "Changing password settings",
      ],
      answer: 0,
    },
  ],
  8: [
    {
      prompt: "In physical computing, what is an input?",
      options: [
        "Something the device receives or detects",
        "A sound the device makes",
        "A picture on the screen",
        "The project name",
      ],
      answer: 0,
    },
    {
      prompt: "What is an output on a micro:bit?",
      options: [
        "Something the device does in response, such as showing LEDs",
        "A desk in the classroom",
        "The browser tab",
        "The code title only",
      ],
      answer: 0,
    },
    {
      prompt: "What is the emulator used for?",
      options: [
        "Testing the program on screen",
        "Replacing all code",
        "Printing worksheets",
        "Changing the computer keyboard",
      ],
      answer: 0,
    },
    {
      prompt: "Which block often appears at the start of a MakeCode project?",
      options: ["on start", "game over", "paint stage", "rename class"],
      answer: 0,
    },
    {
      prompt: "What is a simple first output for a micro:bit?",
      options: [
        "An LED pattern",
        "A full website",
        "A printed certificate",
        "A speaker tower",
      ],
      answer: 0,
    },
    {
      prompt: "Which sequence is correct?",
      options: [
        "input → process → output",
        "output → input → process",
        "process → output → input only",
        "variable → costume → microphone",
      ],
      answer: 0,
    },
    {
      prompt: "How is a micro:bit project different from a simple Scratch display?",
      options: [
        "It controls a physical device and its outputs",
        "It cannot use code",
        "It has no events",
        "It never needs testing",
      ],
      answer: 0,
    },
    {
      prompt: "What should pupils understand in this lesson?",
      options: [
        "Devices still follow precise instructions from code",
        "Devices always know what to do without code",
        "Physical computing removes the need for logic",
        "Inputs and outputs are the same thing",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main purpose of the LED grid in early lessons?",
      options: [
        "To provide visible output",
        "To store class names",
        "To hide variables",
        "To remove buttons",
      ],
      answer: 0,
    },
    {
      prompt: "This lesson is mainly about:",
      options: [
        "Understanding input, process, and output on micro:bit",
        "Drawing a poster",
        "Editing a video",
        "Making a spreadsheet",
      ],
      answer: 0,
    },
  ],
  9: [
    {
      prompt: "What does if... then... else allow a program to do?",
      options: [
        "Choose between different outcomes",
        "Delete the project",
        "Avoid all input",
        "Replace all outputs",
      ],
      answer: 0,
    },
    {
      prompt: "When does the else path run?",
      options: [
        "When the condition is false",
        "When the condition is true",
        "Before the code starts",
        "Only after saving",
      ],
      answer: 0,
    },
    {
      prompt: "Which input is useful for a simple MakeCode condition?",
      options: ["button A", "desk colour", "teacher email", "font size"],
      answer: 0,
    },
    {
      prompt: "Why is selection important in physical computing?",
      options: [
        "It lets the device react differently depending on what happens",
        "It removes all need for code",
        "It makes the hardware invisible",
        "It stops all tests",
      ],
      answer: 0,
    },
    {
      prompt: "What should happen in a good else branch?",
      options: [
        "A meaningful alternative output",
        "Nothing planned at all",
        "A classroom bell",
        "A deleted variable",
      ],
      answer: 0,
    },
    {
      prompt: "What does flow mean in this lesson?",
      options: [
        "The order and path the code follows",
        "How bright the screen is",
        "How fast the internet is",
        "How many pupils are present",
      ],
      answer: 0,
    },
    {
      prompt: "If button A is pressed then show a heart, else show a square. What changes the output?",
      options: ["The condition result", "The project title", "The browser name", "The device colour"],
      answer: 0,
    },
    {
      prompt: "What should pupils avoid misunderstanding?",
      options: [
        "Else is an important second path, not an optional decoration",
        "Else means repeat forever",
        "Else is only for adults",
        "Else creates a variable automatically",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement is strongest?",
      options: [
        "Selection controls the device’s behaviour logically",
        "Selection is only for making the code longer",
        "Selection removes all sensors",
        "Selection is never useful in real devices",
      ],
      answer: 0,
    },
    {
      prompt: "This lesson mainly develops:",
      options: [
        "decision-making in MakeCode",
        "sound recording",
        "typing speed",
        "spreadsheet formulas",
      ],
      answer: 0,
    },
  ],
  10: [
    {
      prompt: "What is a sensor input?",
      options: [
        "Information the device detects from actions or movement",
        "A decoration on the stage",
        "A saved screenshot",
        "A spreadsheet row",
      ],
      answer: 0,
    },
    {
      prompt: "Which is a built-in input on a micro:bit?",
      options: ["button press", "printer cable", "monitor stand", "desk drawer"],
      answer: 0,
    },
    {
      prompt: "What can the accelerometer detect?",
      options: ["movement or gesture", "font choice", "browser theme", "school logo"],
      answer: 0,
    },
    {
      prompt: "Why are buttons useful in early physical computing projects?",
      options: [
        "They provide a clear and simple input",
        "They replace all variables",
        "They turn outputs into inputs",
        "They stop code from running",
      ],
      answer: 0,
    },
    {
      prompt: "Why might a project use both a button and a shake gesture?",
      options: [
        "To allow different inputs to produce different responses",
        "To make the code less clear",
        "To avoid using output",
        "To stop the emulator working",
      ],
      answer: 0,
    },
    {
      prompt: "What is a trigger?",
      options: [
        "The event that causes code to respond",
        "A type of background image",
        "A timer title",
        "A variable name only",
      ],
      answer: 0,
    },
    {
      prompt: "What does interactive mean in this lesson?",
      options: [
        "The device responds to what the user does",
        "The device ignores all inputs",
        "The project only shows text once",
        "The code cannot change",
      ],
      answer: 0,
    },
    {
      prompt: "If button A and shake both have outputs, what must the code do?",
      options: [
        "Link each input to the correct response",
        "Use the same output for everything without reason",
        "Delete the inputs",
        "Avoid testing",
      ],
      answer: 0,
    },
    {
      prompt: "What mistake should pupils avoid?",
      options: [
        "Thinking the micro:bit reacts without programmed triggers",
        "Using more than one input",
        "Testing in the emulator",
        "Naming a project clearly",
      ],
      answer: 0,
    },
    {
      prompt: "This lesson mainly focuses on:",
      options: [
        "using buttons and motion as inputs",
        "editing a web page",
        "drawing charts",
        "setting a classroom timer only",
      ],
      answer: 0,
    },
  ],
  11: [
    {
      prompt: "What is a variable useful for in MakeCode?",
      options: [
        "Tracking a changing value such as steps or counts",
        "Changing the desk position",
        "Printing worksheets",
        "Creating internet access",
      ],
      answer: 0,
    },
    {
      prompt: "If a project counts shakes, what should usually happen first?",
      options: [
        "Set the variable to 0 at the start",
        "Hide the variable and never change it",
        "Delete the condition",
        "Remove the input block",
      ],
      answer: 0,
    },
    {
      prompt: "What does change steps by 1 do?",
      options: [
        "Adds one to the current count",
        "Always returns the value to 1",
        "Deletes the value",
        "Turns the value into a picture",
      ],
      answer: 0,
    },
    {
      prompt: "Why compare a variable to a target value?",
      options: [
        "So the device can decide when to react",
        "So the code becomes longer only",
        "So the output disappears forever",
        "So the input no longer matters",
      ],
      answer: 0,
    },
    {
      prompt: "Which comparison fits a milestone output?",
      options: ["steps > 9", "show leds", "on start", "button A only"],
      answer: 0,
    },
    {
      prompt: "What is the relationship between the sensor and the variable?",
      options: [
        "The sensor detects an event; the variable counts it",
        "The variable detects the movement and the sensor stores it",
        "They do the same job",
        "Neither is needed in physical computing",
      ],
      answer: 0,
    },
    {
      prompt: "Why is this lesson an important Year 6 link?",
      options: [
        "It combines variable thinking with physical input and logic",
        "It removes the need for all previous learning",
        "It focuses only on decoration",
        "It replaces MakeCode with spreadsheets",
      ],
      answer: 0,
    },
    {
      prompt: "If a micro:bit should celebrate at 10 counts, what is required?",
      options: [
        "A condition using the variable",
        "A new school logo",
        "A desktop wallpaper",
        "A printed booklet",
      ],
      answer: 0,
    },
    {
      prompt: "What would show weak understanding?",
      options: [
        "Thinking the sensor and variable are the same thing",
        "Explaining that movement changes the count",
        "Using a start value of zero",
        "Testing the response",
      ],
      answer: 0,
    },
    {
      prompt: "This lesson is mainly about:",
      options: [
        "using a variable with logic in MakeCode",
        "adding titles only",
        "saving screenshots",
        "creating pupil accounts",
      ],
      answer: 0,
    },
  ],
  12: [
    {
      prompt: "What are the three key parts of a simple step counter?",
      options: [
        "input, variable, output",
        "music, costume, backdrop",
        "mouse, keyboard, monitor",
        "teacher, desk, board",
      ],
      answer: 0,
    },
    {
      prompt: "Which input might a step counter use on micro:bit?",
      options: ["movement or shake", "speaker volume", "font style", "screen size"],
      answer: 0,
    },
    {
      prompt: "What should the variable usually track?",
      options: ["number of detected steps", "colour of the LEDs", "name of the project", "device battery type"],
      answer: 0,
    },
    {
      prompt: "Why does a step counter need output?",
      options: [
        "So the user can see the result or progress",
        "So the variable can be deleted",
        "So the micro:bit stops working",
        "So the code has no purpose",
      ],
      answer: 0,
    },
    {
      prompt: "What is the value of planning before building the step counter?",
      options: [
        "It makes the system clearer and easier to implement",
        "It replaces all code forever",
        "It prevents any testing",
        "It removes the need for logic",
      ],
      answer: 0,
    },
    {
      prompt: "What might be a useful extension to a step counter?",
      options: [
        "Celebrate when a target count is reached",
        "Delete the count every second randomly",
        "Remove all outputs",
        "Ignore movement inputs",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement is correct?",
      options: [
        "A clear design shows how input, variable, and output connect",
        "A good design does not need an algorithm",
        "A device should be built without deciding the rules",
        "Variables are not useful in physical computing",
      ],
      answer: 0,
    },
    {
      prompt: "What would show good design thinking?",
      options: [
        "Explaining what happens at start, during movement, and at milestones",
        "Choosing only a favourite colour",
        "Typing code without a plan",
        "Ignoring how the user sees the result",
      ],
      answer: 0,
    },
    {
      prompt: "What misconception should be avoided?",
      options: [
        "Thinking planning is separate from programming quality",
        "Knowing that variables track values",
        "Using output to show results",
        "Choosing an input carefully",
      ],
      answer: 0,
    },
    {
      prompt: "The final lesson is mainly about:",
      options: [
        "designing a step counter system",
        "creating a video title",
        "building a spreadsheet graph",
        "changing the teacher password",
      ],
      answer: 0,
    },
  ],
};

function slugifyName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normaliseName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function buildStorageKey(className: string, studentName: string) {
  return `year6-${className}-${slugifyName(studentName)}`;
}

function getRegistry(): LearnerProfile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REGISTRY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LearnerProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRegistry(registry: LearnerProfile[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
}

function addProfileToRegistry(profile: LearnerProfile) {
  const existing = getRegistry();
  const alreadyExists = existing.some((item) => item.storageKey === profile.storageKey);
  if (!alreadyExists) {
    saveRegistry(
      [...existing, profile].sort((a, b) => {
        if (a.className !== b.className) return a.className.localeCompare(b.className);
        return a.studentName.localeCompare(b.studentName);
      })
    );
  }
}

function removeProfileFromRegistry(profile: LearnerProfile) {
  const existing = getRegistry();
  const filtered = existing.filter((item) => item.storageKey !== profile.storageKey);
  saveRegistry(filtered);
}

function buildQuiz(lessonId: number): QuizQuestion[] {
  return quizBank[lessonId] || [];
}

function safeParseQuizOrderMap(raw: string | null): QuizOrderMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function safeParseQuizResultMap(raw: string | null): Record<number, QuizResult> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function safeParseScreenshotMap(raw: string | null): ScreenshotMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function safeParseNumberArray(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => Number.isInteger(item)) : [];
  } catch {
    return [];
  }
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuizOrder(questions: QuizQuestion[]): number[][] {
  return questions.map((question) =>
    shuffleArray(question.options.map((_, optionIndex) => optionIndex))
  );
}

function applyQuizOrder(questions: QuizQuestion[], quizOrder: number[][]): QuizQuestionView[] {
  return questions.map((question, questionIndex) => {
    const savedOrder = quizOrder[questionIndex];
    const validSavedOrder =
      Array.isArray(savedOrder) &&
      savedOrder.length === question.options.length &&
      question.options.every((_, optionIndex) => savedOrder.includes(optionIndex));

    const optionOrder = validSavedOrder
      ? savedOrder
      : question.options.map((_, optionIndex) => optionIndex);

    return {
      ...question,
      options: optionOrder.map((optionIndex) => question.options[optionIndex]),
      originalOptionIndexes: optionOrder,
    };
  });
}

function getLessonStateLabel(
  lessonId: number,
  completed: number[],
  quizState: Record<number, QuizResult>,
  questionCount: number
) {
  const result = quizState[lessonId];
  const isCompleted = completed.includes(lessonId);

  if (result?.submitted && questionCount > 0) {
    const percent = Math.round((result.score / questionCount) * 100);
    if (percent >= 80) {
      return {
        label: "Mastered",
        bg: "#dcfce7",
        border: "#86efac",
        text: "#166534",
      };
    }
    return {
      label: "Submitted",
      bg: "#fef3c7",
      border: "#fcd34d",
      text: "#92400e",
    };
  }

  if (isCompleted) {
    return {
      label: "Complete",
      bg: "#dbeafe",
      border: "#93c5fd",
      text: "#1d4ed8",
    };
  }

  return {
    label: "Not started",
    bg: "#f8fafc",
    border: "#cbd5e1",
    text: "#475569",
  };
}

function getMasteryText(score: number, total: number) {
  if (total === 0) return "Not attempted";
  const percent = Math.round((score / total) * 100);
  if (percent >= 80) return "Mastered";
  if (percent >= 60) return "Developing well";
  if (percent >= 40) return "Working towards security";
  return "Needs review";
}

export default function Home() {
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [quizState, setQuizState] = useState<Record<number, QuizResult>>({});
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number[]>>({});
  const [screenshots, setScreenshots] = useState<ScreenshotMap>({});
  const [quizOrderMap, setQuizOrderMap] = useState<QuizOrderMap>({});
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  const [startMode, setStartMode] = useState<StartMode>("existing");
  const [setupClass, setSetupClass] = useState<string>(CLASS_OPTIONS[0]);
  const [setupStudentName, setSetupStudentName] = useState("");
  const [setupAccessCode, setSetupAccessCode] = useState("");
  const [existingClass, setExistingClass] = useState<string>(CLASS_OPTIONS[0]);
  const [accessCodeInputs, setAccessCodeInputs] = useState<Record<string, string>>({});
  const [cloudStatus, setCloudStatus] = useState("Cloud sync has not run yet.");
  const [registry, setRegistry] = useState<LearnerProfile[]>([]);

  useEffect(() => {
    const loadedRegistry = getRegistry();
    setRegistry(loadedRegistry);

    const savedProfile = localStorage.getItem(CURRENT_PROFILE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as LearnerProfile;
        setProfile(parsed);
        setSetupClass(parsed.className);
        setSetupStudentName(parsed.studentName);
        setExistingClass(parsed.className);
      } catch {
        localStorage.removeItem(CURRENT_PROFILE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!profile) return;

    let cancelled = false;
    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));

    const savedProgress = localStorage.getItem(`${profile.storageKey}-progress`);
    const savedQuiz = localStorage.getItem(`${profile.storageKey}-quiz-results`);
    const savedScreenshots = localStorage.getItem(`${profile.storageKey}-screenshots`);
    const savedQuizOrder = localStorage.getItem(`${profile.storageKey}-quiz-order`);

    const localCompleted = safeParseNumberArray(savedProgress);
    const localQuizState = safeParseQuizResultMap(savedQuiz);
    const localScreenshots = safeParseScreenshotMap(savedScreenshots);

    setCompleted(localCompleted);
    setQuizState(localQuizState);
    setCurrentAnswers({});
    setScreenshots(localScreenshots);
    setQuizOrderMap(safeParseQuizOrderMap(savedQuizOrder));
    setSelectedLessonId(1);

    setCloudStatus("Checking cloud sync...");
    saveCloudProfile(profile)
      .then(() => {
        if (!cancelled) setCloudStatus("Cloud profile connected.");
      })
      .catch((error) => {
        console.warn("Could not save pupil profile to Supabase.", error);
        if (!cancelled) {
          setCloudStatus(`Cloud sync failed: ${error?.message || "check Supabase settings."}`);
        }
      });

    loadCloudProfileData(profile.storageKey)
      .then((cloudData) => {
        if (!cloudData || cancelled) return;
        const mergedCompleted = Array.from(
          new Set([...localCompleted, ...cloudData.completedLessonIds])
        ).sort((a, b) => a - b);
        const mergedQuizState = { ...cloudData.quizMap, ...localQuizState };
        const mergedScreenshots = { ...cloudData.screenshots, ...localScreenshots };
        setCompleted(mergedCompleted);
        setQuizState(mergedQuizState);
        setScreenshots(mergedScreenshots);
      })
      .catch((error) => {
        console.warn("Could not load pupil progress from Supabase.", error);
        if (!cancelled) {
          setCloudStatus(`Cloud load failed: ${error?.message || "check Supabase settings."}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(`${profile.storageKey}-progress`, JSON.stringify(completed));
  }, [completed, profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(`${profile.storageKey}-quiz-results`, JSON.stringify(quizState));
  }, [quizState, profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(`${profile.storageKey}-screenshots`, JSON.stringify(screenshots));
  }, [screenshots, profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(`${profile.storageKey}-quiz-order`, JSON.stringify(quizOrderMap));
  }, [quizOrderMap, profile]);

  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) || lessons[0];

  const baseQuiz = useMemo(() => buildQuiz(selectedLesson.id), [selectedLesson.id]);

  useEffect(() => {
    if (!profile) return;

    setQuizOrderMap((prev) => {
      const existingOrder = prev[selectedLesson.id];
      const isValidExistingOrder =
        Array.isArray(existingOrder) &&
        existingOrder.length === baseQuiz.length &&
        baseQuiz.every((question, questionIndex) => {
          const orderForQuestion = existingOrder[questionIndex];
          return (
            Array.isArray(orderForQuestion) &&
            orderForQuestion.length === question.options.length &&
            question.options.every((_, optionIndex) => orderForQuestion.includes(optionIndex))
          );
        });

      if (isValidExistingOrder) return prev;

      return {
        ...prev,
        [selectedLesson.id]: buildQuizOrder(baseQuiz),
      };
    });
  }, [profile, selectedLesson.id, baseQuiz]);

  const quiz = useMemo(() => {
    const lessonOrder = quizOrderMap[selectedLesson.id] || [];
    return applyQuizOrder(baseQuiz, lessonOrder);
  }, [baseQuiz, quizOrderMap, selectedLesson.id]);

  const submittedResult = quizState[selectedLesson.id];
  const selectedAnswers =
    currentAnswers[selectedLesson.id] || Array(quiz.length).fill(-1);
  const progress = Math.round((completed.length / lessons.length) * 100);
  const masteredCount = lessons.filter((lesson) => {
    const result = quizState[lesson.id];
    const questionCount = buildQuiz(lesson.id).length;
    return result?.submitted && questionCount > 0 && result.score / questionCount >= 0.8;
  }).length;
  const selectedScreenshot = screenshots[selectedLesson.id];
  const scorePercent =
    submittedResult && quiz.length > 0
      ? Math.round((submittedResult.score / quiz.length) * 100)
      : 0;

  const groupedLessons = useMemo(
    () => ({
      "Summer Term 1": lessons.filter((lesson) => lesson.term === "Summer Term 1"),
      "Summer Term 2": lessons.filter((lesson) => lesson.term === "Summer Term 2"),
    }),
    []
  );

  const existingPupilsForClass = useMemo(() => {
    return registry.filter((item) => item.className === existingClass);
  }, [registry, existingClass]);

  const startNewSession = () => {
    if (!setupClass) {
      alert("Please choose a class.");
      return;
    }

    const cleanName = normaliseName(setupStudentName);
    if (!cleanName) {
      alert("Please enter the student name.");
      return;
    }

    const cleanAccessCode = setupAccessCode.trim();
    if (cleanAccessCode.length < 4) {
      alert("Please enter an access code with at least 4 characters.");
      return;
    }

    const storageKey = buildStorageKey(setupClass, cleanName);
    const newProfile: LearnerProfile = {
      className: setupClass,
      studentName: cleanName,
      storageKey,
      accessCode: cleanAccessCode,
    };

    addProfileToRegistry(newProfile);
    const updatedRegistry = getRegistry();
    setRegistry(updatedRegistry);
    setProfile(newProfile);
    setExistingClass(setupClass);
    setSetupAccessCode("");

    saveCloudProfile(newProfile).catch((error) => {
      console.warn("Could not save pupil profile to Supabase.", error);
      setCloudStatus(`Cloud sync failed: ${error?.message || "profile not saved."}`);
    });
  };

  const openExistingPupil = (selectedProfile: LearnerProfile) => {
    const savedAccessCode = selectedProfile.accessCode;
    const enteredAccessCode = accessCodeInputs[selectedProfile.storageKey]?.trim() || "";

    if (savedAccessCode && enteredAccessCode !== savedAccessCode) {
      alert("Please enter the correct access code for this pupil.");
      return;
    }
    setProfile(selectedProfile);
    setSetupClass(selectedProfile.className);
    setSetupStudentName(selectedProfile.studentName);
    setExistingClass(selectedProfile.className);
  };

  const switchLearner = () => {
    setProfile(null);
    setCurrentAnswers({});
    setQuizOrderMap({});
    setAccessCodeInputs({});
    setStartMode("existing");
    setRegistry(getRegistry());
  };
  const markComplete = () => {
    if (!completed.includes(selectedLesson.id)) {
      setCompleted((prev) => [...prev, selectedLesson.id].sort((a, b) => a - b));
      if (profile) {
        setCloudStatus("Saving lesson completion to cloud...");
        saveCloudLessonProgress(profile, selectedLesson.id, { completed: true })
          .then(() => setCloudStatus("Lesson completion saved to cloud."))
          .catch((error) => {
            console.warn("Could not save lesson completion to Supabase.", error);
            setCloudStatus(`Cloud sync failed: ${error?.message || "lesson not saved."}`);
          });
      }
    }
  };

  const resetCurrentLearnerProgress = () => {
    if (!profile) return;

    const confirmed = window.confirm(
      `Reset all saved progress for ${profile.studentName}? This will clear lesson completion, quiz data, quiz order, and screenshots for this browser.`
    );
    if (!confirmed) return;

    setCompleted([]);
    setQuizState({});
    setCurrentAnswers({});
    setScreenshots({});
    setQuizOrderMap({});

    localStorage.removeItem(`${profile.storageKey}-progress`);
    localStorage.removeItem(`${profile.storageKey}-quiz-results`);
    localStorage.removeItem(`${profile.storageKey}-quiz-order`);
    localStorage.removeItem(`${profile.storageKey}-screenshots`);

    deleteCloudPupilData(profile).catch((error) => {
      console.warn("Could not reset pupil progress in Supabase.", error);
    });
  };

  const exportCurrentLearnerData = () => {
    if (!profile) return;

    const payload: PupilExport = {
      app: "year6-computing",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      completedLessonIds: completed,
      quizResults: quizState,
      quizOrder: quizOrderMap,
      screenshots,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.storageKey}-teacher-results.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const syncCurrentLearnerToCloud = async () => {
    if (!profile) return;

    setCloudStatus("Syncing to cloud...");

    try {
      await saveCloudProfile(profile);
      const lessonIds = new Set<number>([
        ...completed,
        ...Object.keys(quizState).map(Number),
        ...Object.keys(screenshots).map(Number),
      ]);

      for (const lessonId of lessonIds) {
        if (!Number.isInteger(lessonId)) continue;
        await saveCloudLessonProgress(profile, lessonId, {
          completed: completed.includes(lessonId),
          quizResult: quizState[lessonId],
          screenshot: screenshots[lessonId] || null,
        });
      }

      setCloudStatus(
        `Cloud sync complete at ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}.`
      );
    } catch (error: any) {
      console.warn("Could not sync pupil data to Supabase.", error);
      setCloudStatus(`Cloud sync failed: ${error?.message || "check Supabase settings."}`);
    }
  };

  const chooseAnswer = (questionIndex: number, optionIndex: number) => {
    if (submittedResult?.submitted) return;
    const updated = [...selectedAnswers];
    updated[questionIndex] = optionIndex;
    setCurrentAnswers((prev) => ({ ...prev, [selectedLesson.id]: updated }));
  };

  const submitQuiz = () => {
    if (submittedResult?.submitted) return;

    if (selectedAnswers.some((answer) => answer === -1)) {
      alert("Please answer all 10 questions before submitting.");
      return;
    }

    let score = 0;
    quiz.forEach((question, index) => {
      const displayedIndex = selectedAnswers[index];
      const originalIndex = question.originalOptionIndexes[displayedIndex];
      if (originalIndex === question.answer) {
        score += 1;
      }
    });

    const quizResult: QuizResult = {
      submitted: true,
      score,
      answers: selectedAnswers,
    };

    setQuizState((prev) => ({
      ...prev,
      [selectedLesson.id]: quizResult,
    }));

    if (profile) {
      setCloudStatus("Saving quiz result to cloud...");
      saveCloudLessonProgress(profile, selectedLesson.id, {
        completed: completed.includes(selectedLesson.id),
        quizResult,
      })
        .then(() => setCloudStatus("Quiz result saved to cloud."))
        .catch((error) => {
          console.warn("Could not save quiz result to Supabase.", error);
          setCloudStatus(`Cloud sync failed: ${error?.message || "quiz not saved."}`);
        });
    }

    if (!completed.includes(selectedLesson.id)) {
      setCompleted((prev) => [...prev, selectedLesson.id].sort((a, b) => a - b));
    }
  };

  const handleScreenshotUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setScreenshots((prev) => ({
          ...prev,
          [selectedLesson.id]: result,
        }));

        if (profile) {
          setCloudStatus("Saving screenshot to cloud...");
          saveCloudLessonProgress(profile, selectedLesson.id, {
            completed: completed.includes(selectedLesson.id),
            quizResult: quizState[selectedLesson.id],
            screenshot: result,
          })
            .then(() => setCloudStatus("Screenshot saved to cloud."))
            .catch((error) => {
              console.warn("Could not save screenshot to Supabase.", error);
              setCloudStatus(`Cloud sync failed: ${error?.message || "screenshot not saved."}`);
            });
        }
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const clearScreenshot = () => {
    setScreenshots((prev) => {
      const updated = { ...prev };
      delete updated[selectedLesson.id];
      return updated;
    });

    if (profile) {
      setCloudStatus("Removing screenshot from cloud...");
      saveCloudLessonProgress(profile, selectedLesson.id, {
        completed: completed.includes(selectedLesson.id),
        quizResult: quizState[selectedLesson.id],
        screenshot: null,
      })
        .then(() => setCloudStatus("Screenshot removed from cloud."))
        .catch((error) => {
          console.warn("Could not remove screenshot from Supabase.", error);
          setCloudStatus(`Cloud sync failed: ${error?.message || "screenshot not removed."}`);
        });
    }
  };

  if (!profile) {
    return (
      <main
        style={{
          padding: 32,
          fontFamily: "Inter, Arial, sans-serif",
          maxWidth: 1120,
          margin: "0 auto",
          background: pastel.page,
          color: pastel.text,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 45%, #ecfeff 100%)",
            border: `1px solid ${pastel.border}`,
            borderRadius: 28,
            padding: 32,
            boxShadow: pastel.shadow,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 14,
                color: pastel.accent,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              APSR Computing Platform
            </div>
            <h1
              style={{
                fontSize: 48,
                lineHeight: 1.05,
                margin: "8px 0 10px",
                color: pastel.title,
              }}
            >
              APSR Year 6 Computing
            </h1>
            <p style={{ fontSize: 20, margin: 0, maxWidth: 860 }}>
              Variables in Scratch and sensing with Micro:bit. Choose an existing
              pupil or create a new pupil learning space on this browser, or open the teacher dashboard.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <button
              onClick={() => setStartMode("existing")}
              style={{
                padding: "14px 18px",
                borderRadius: 16,
                border:
                  startMode === "existing"
                    ? "1px solid #c4b5fd"
                    : `1px solid ${pastel.border}`,
                background:
                  startMode === "existing"
                    ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                    : pastel.panel,
                color: pastel.title,
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Choose Existing Pupil
            </button>

            <button
              onClick={() => setStartMode("new")}
              style={{
                padding: "14px 18px",
                borderRadius: 16,
                border:
                  startMode === "new"
                    ? "1px solid #c4b5fd"
                    : `1px solid ${pastel.border}`,
                background:
                  startMode === "new"
                    ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                    : pastel.panel,
                color: pastel.title,
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Create New Pupil
            </button>

            <a
              href="/teacher"
              style={{
                padding: "14px 18px",
                borderRadius: 16,
                border: `1px solid ${pastel.border}`,
                background: pastel.panel,
                color: pastel.title,
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 16,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Teacher Dashboard
            </a>
          </div>

          {startMode === "new" ? (
            <div
              style={{
                background: "rgba(255,255,255,0.82)",
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 24,
                display: "grid",
                gap: 18,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: pastel.title,
                }}
              >
                New Pupil
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ fontWeight: 700 }}>Class</label>
                <select
                  value={setupClass}
                  onChange={(event) => setSetupClass(event.target.value)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${pastel.border}`,
                    background: "#ffffff",
                    fontSize: 16,
                    color: pastel.title,
                  }}
                >
                  {CLASS_OPTIONS.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ fontWeight: 700 }}>Student Name</label>
                <input
                  value={setupStudentName}
                  onChange={(event) => setSetupStudentName(event.target.value)}
                  placeholder="Enter pupil name"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${pastel.border}`,
                    background: "#ffffff",
                    fontSize: 16,
                    color: pastel.title,
                  }}
                />
              </div>


              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ fontWeight: 700 }}>Access Code</label>
                <input
                  value={setupAccessCode}
                  onChange={(event) => setSetupAccessCode(event.target.value)}
                  placeholder="Choose a code pupils can remember"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${pastel.border}`,
                    background: "#ffffff",
                    fontSize: 16,
                    color: pastel.title,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={startNewSession}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 16,
                    border: "none",
                    background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  Start Learning Space
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.82)",
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 24,
                display: "grid",
                gap: 18,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: pastel.title,
                }}
              >
                Existing Pupils
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ fontWeight: 700 }}>Filter by Class</label>
                <select
                  value={existingClass}
                  onChange={(event) => setExistingClass(event.target.value)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${pastel.border}`,
                    background: "#ffffff",
                    fontSize: 16,
                    color: pastel.title,
                  }}
                >
                  {CLASS_OPTIONS.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
              </div>

              {existingPupilsForClass.length === 0 ? (
                <div
                  style={{
                    border: `1px dashed ${pastel.border}`,
                    borderRadius: 18,
                    padding: 20,
                    background: pastel.panelSoft,
                    color: "#64748b",
                  }}
                >
                  No saved pupils found for {existingClass} on this browser yet.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {existingPupilsForClass.map((item) => (
                    <div
                      key={item.storageKey}
                      style={{
                        border: `1px solid ${pastel.border}`,
                        borderRadius: 18,
                        padding: 16,
                        background: "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: pastel.title, fontSize: 18 }}>
                          {item.studentName}
                        </div>
                        <div style={{ color: "#64748b", fontSize: 14 }}>{item.className}</div>
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        {item.accessCode && (
                          <input
                            type="password"
                            value={accessCodeInputs[item.storageKey] || ""}
                            onChange={(event) =>
                              setAccessCodeInputs((prev) => ({
                                ...prev,
                                [item.storageKey]: event.target.value,
                              }))
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") openExistingPupil(item);
                            }}
                            placeholder="Access code"
                            style={{
                              width: 150,
                              padding: "10px 12px",
                              borderRadius: 999,
                              border: `1px solid ${pastel.border}`,
                              fontWeight: 700,
                              outline: "none",
                            }}
                          />
                        )}
                        <button
                          onClick={() => openExistingPupil(item)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: 999,
                            border: "none",
                            background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                            color: "#ffffff",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 32,
        fontFamily: "Inter, Arial, sans-serif",
        maxWidth: 1500,
        margin: "0 auto",
        background: pastel.page,
        color: pastel.text,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 45%, #ecfeff 100%)",
          border: `1px solid ${pastel.border}`,
          borderRadius: 28,
          padding: 28,
          boxShadow: pastel.shadow,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: pastel.accent,
                fontWeight: 700,
                letterSpacing: 0.3,
                marginBottom: 8,
              }}
            >
              APSR Computing Platform
            </div>

            <h1
              style={{
                fontSize: 50,
                lineHeight: 1.05,
                margin: "0 0 10px",
                color: pastel.title,
              }}
            >
              APSR Year 6 Computing
            </h1>

            <p style={{ fontSize: 22, margin: "0 0 12px" }}>
              Variables in Scratch • Sensing with Micro:bit
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: 14,
                  color: pastel.title,
                }}
              >
                {profile.className}
              </span>

              <span
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: 14,
                  color: pastel.title,
                }}
              >
                {profile.studentName}
              </span>

              <button
                onClick={switchLearner}
                style={{
                  border: `1px solid ${pastel.border}`,
                  background: pastel.panel,
                  color: pastel.title,
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Switch Pupil
              </button>

              <button
                onClick={exportCurrentLearnerData}
                style={{
                  border: `1px solid ${pastel.border}`,
                  background: pastel.panelMint,
                  color: pastel.title,
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Export for Teacher
              </button>

              <button
                onClick={syncCurrentLearnerToCloud}
                style={{
                  border: `1px solid ${pastel.border}`,
                  background: pastel.panelBlue,
                  color: pastel.title,
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Sync Now
              </button>

              <a
                href="/teacher"
                style={{
                  border: `1px solid ${pastel.border}`,
                  background: pastel.panel,
                  color: pastel.title,
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Teacher Dashboard
              </a>

              <span
                style={{
                  background: cloudStatus.includes("failed")
                    ? pastel.roseSoft
                    : "rgba(255,255,255,0.8)",
                  border: cloudStatus.includes("failed")
                    ? "1px solid #fecdd3"
                    : `1px solid ${pastel.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 700,
                  fontSize: 13,
                  color: cloudStatus.includes("failed")
                    ? pastel.rose
                    : pastel.title,
                }}
              >
                {cloudStatus}
              </span>
            </div>
          </div>

          <div
            style={{
              minWidth: 340,
              background: "rgba(255,255,255,0.78)",
              border: `1px solid ${pastel.border}`,
              borderRadius: 22,
              padding: 18,
              display: "grid",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 800,
              }}
            >
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>

            <div
              style={{
                height: 14,
                background: "#e2e8f0",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                }}
              />
            </div>

            <div style={{ fontSize: 14, color: "#64748b" }}>
              {completed.length} of {lessons.length} lessons marked complete
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#166534",
                }}
              >
                Mastered: {masteredCount}
              </span>

              <span
                style={{
                  background: "#dbeafe",
                  border: "1px solid #93c5fd",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#1d4ed8",
                }}
              >
                Platform: {selectedLesson.platform}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        <aside
          style={{
            background: pastel.panel,
            border: `1px solid ${pastel.border}`,
            borderRadius: 24,
            padding: 22,
            boxShadow: pastel.shadow,
            position: "sticky",
            top: 20,
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              gap: 12,
            }}
          >
            <h2 style={{ fontSize: 34, margin: 0, color: pastel.title }}>
              Lessons
            </h2>

            <button
              onClick={resetCurrentLearnerProgress}
              style={{
                border: `1px solid ${pastel.border}`,
                background: pastel.panelLilac,
                color: pastel.title,
                borderRadius: 999,
                padding: "10px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          {(["Summer Term 1", "Summer Term 2"] as TermName[]).map((term) => (
            <div key={term} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: pastel.accent,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                {term}
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {groupedLessons[term].map((lesson) => {
                  const lessonQuizCount = buildQuiz(lesson.id).length;
                  const stateLabel = getLessonStateLabel(
                    lesson.id,
                    completed,
                    quizState,
                    lessonQuizCount
                  );
                  const isSelected = lesson.id === selectedLessonId;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: 14,
                        borderRadius: 18,
                        border: isSelected
                          ? "1px solid #c4b5fd"
                          : `1px solid ${pastel.border}`,
                        background: isSelected
                          ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                          : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "start",
                          marginBottom: 8,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: pastel.title }}>
                            {lesson.id}. {lesson.shortTitle}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                            Week {lesson.week} • {lesson.platform}
                          </div>
                        </div>

                        <span
                          style={{
                            background: stateLabel.bg,
                            border: `1px solid ${stateLabel.border}`,
                            color: stateLabel.text,
                            borderRadius: 999,
                            padding: "5px 10px",
                            fontSize: 12,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stateLabel.label}
                        </span>
                      </div>

                      <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.45 }}>
                        {lesson.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <section style={{ display: "grid", gap: 24 }}>
          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: pastel.shadow,
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <span
                style={{
                  background: pastel.panelBlue,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 800,
                  color: pastel.title,
                }}
              >
                Lesson {selectedLesson.id}
              </span>

              <span
                style={{
                  background: selectedLesson.platform === "Scratch" ? pastel.panelPeach : pastel.panelMint,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 800,
                  color: pastel.title,
                }}
              >
                {selectedLesson.platform}
              </span>

              <span
                style={{
                  background: pastel.panelSoft,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 800,
                  color: pastel.title,
                }}
              >
                {selectedLesson.term}
              </span>
            </div>

            <h2
              style={{
                fontSize: 38,
                lineHeight: 1.1,
                margin: "0 0 8px",
                color: pastel.title,
              }}
            >
              {selectedLesson.title}
            </h2>

            <p style={{ fontSize: 19, margin: "0 0 16px", color: "#475569" }}>
              {selectedLesson.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <div
                style={{
                  background: pastel.panelBlue,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: pastel.accent, marginBottom: 8 }}>
                  OBJECTIVE
                </div>
                <div style={{ color: pastel.title, fontWeight: 700, lineHeight: 1.5 }}>
                  {selectedLesson.objective}
                </div>
              </div>

              <div
                style={{
                  background: pastel.panelMint,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: pastel.accent, marginBottom: 8 }}>
                  OVERVIEW
                </div>
                <div style={{ color: pastel.title, lineHeight: 1.6 }}>
                  {selectedLesson.overview}
                </div>
              </div>

              <div
                style={{
                  background: pastel.panelPeach,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 18,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: pastel.accent, marginBottom: 8 }}>
                  WHY IT MATTERS
                </div>
                <div style={{ color: pastel.title, lineHeight: 1.6 }}>
                  {selectedLesson.whyItMatters}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 24,
            }}
          >
            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 22,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: pastel.accent,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                Retrieval Starter
              </div>
              <div style={{ fontSize: 18, color: pastel.title, lineHeight: 1.6, fontWeight: 700 }}>
                {selectedLesson.retrievalQuestion}
              </div>
            </div>

            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 22,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: pastel.accent,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                Vocabulary
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {selectedLesson.vocab.map((word) => (
                  <span
                    key={word}
                    style={{
                      background: pastel.accentSoft,
                      border: "1px solid #c4b5fd",
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontWeight: 700,
                      color: "#5b21b6",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: pastel.accent,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Guided Explanation
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {selectedLesson.teachingPoints.map((point, index) => (
                <div
                  key={`${selectedLesson.id}-teaching-${index}`}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "start",
                    background: index % 2 === 0 ? pastel.panelSky : pastel.slateSoft,
                    border: `1px solid ${pastel.border}`,
                    borderRadius: 16,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      color: pastel.accent,
                      background: "#ffffff",
                      border: `1px solid ${pastel.border}`,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ lineHeight: 1.6, color: pastel.title }}>{point}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: pastel.accent,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Step-by-Step Guide
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {selectedLesson.guidedSteps.map((step, index) => (
                <div
                  key={`${selectedLesson.id}-step-${index}`}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "start",
                    border: `1px solid ${pastel.border}`,
                    borderRadius: 16,
                    padding: 14,
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      color: "#ffffff",
                      background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ lineHeight: 1.6 }}>{step}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <a
                href={selectedLesson.projectLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  borderRadius: 999,
                  padding: "12px 16px",
                  background: pastel.panelLilac,
                  border: `1px solid ${pastel.border}`,
                  color: pastel.title,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Open {selectedLesson.platform}
              </a>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 24,
            }}
          >
            <div
              style={{
                background: pastel.panel,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 24,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: pastel.accent,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                Practice Task
              </div>
              <div style={{ fontSize: 18, color: pastel.title, lineHeight: 1.6 }}>
                {selectedLesson.practiceTask}
              </div>
            </div>

            <div
              style={{
                background: "#fff7ed",
                border: "1px solid #fdba74",
                borderRadius: 24,
                padding: 24,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#c2410c",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 12,
                }}
              >
                Challenge Mode
              </div>
              <div style={{ fontSize: 18, color: pastel.title, lineHeight: 1.6 }}>
                {selectedLesson.challengeTask}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <div
              style={{
                background: pastel.panelBlue,
                border: `1px solid ${pastel.border}`,
                borderRadius: 22,
                padding: 18,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: pastel.accent,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Key Question
              </div>
              <div style={{ lineHeight: 1.6, color: pastel.title, fontWeight: 700 }}>
                {selectedLesson.keyQuestion}
              </div>
            </div>

            <div
              style={{
                background: pastel.roseSoft,
                border: "1px solid #fecdd3",
                borderRadius: 22,
                padding: 18,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#be123c",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Common Misconception
              </div>
              <div style={{ lineHeight: 1.6, color: pastel.title }}>
                {selectedLesson.misconception}
              </div>
            </div>

            <div
              style={{
                background: pastel.greenSoft,
                border: "1px solid #86efac",
                borderRadius: 22,
                padding: 18,
                boxShadow: pastel.shadow,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#166534",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 10,
                }}
              >
                Success Looks Like
              </div>
              <div style={{ lineHeight: 1.6, color: pastel.title }}>
                {selectedLesson.correctOutcome}
              </div>
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: pastel.accent,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Watch Out For This
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.6, color: pastel.title }}>
              {selectedLesson.wrongOutcome}
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: pastel.accent,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  Screenshot Upload
                </div>
                <div style={{ color: "#475569" }}>
                  Upload a screenshot of your work for this lesson.
                </div>
              </div>

              <label
                style={{
                  display: "inline-block",
                  borderRadius: 16,
                  padding: "12px 16px",
                  background: pastel.panelLilac,
                  border: `1px solid ${pastel.border}`,
                  fontWeight: 800,
                  color: pastel.title,
                  cursor: "pointer",
                }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {selectedScreenshot ? (
              <div style={{ display: "grid", gap: 16 }}>
                <img
                  src={selectedScreenshot}
                  alt={`Lesson ${selectedLesson.id} screenshot`}
                  style={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                    borderRadius: 18,
                    border: `1px solid ${pastel.border}`,
                    background: "#ffffff",
                  }}
                />

                <div>
                  <button
                    onClick={clearScreenshot}
                    style={{
                      border: "1px solid #fecdd3",
                      background: "#fff1f2",
                      color: "#be123c",
                      borderRadius: 16,
                      padding: "12px 16px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Remove Screenshot
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: `1px dashed ${pastel.border}`,
                  borderRadius: 18,
                  padding: 20,
                  background: pastel.slateSoft,
                  color: "#64748b",
                }}
              >
                No screenshot uploaded yet for this lesson.
              </div>
            )}

            <div style={{ marginTop: 18 }}>
              <button
                onClick={markComplete}
                style={{
                  border: "none",
                  background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  borderRadius: 16,
                  padding: "14px 18px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: pastel.accent,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 8,
                  }}
                >
                  Quiz
                </div>
                <div style={{ color: "#475569" }}>
                  10 questions • randomised answers • one submission only
                </div>
              </div>

              {submittedResult?.submitted ? (
                <div
                  style={{
                    background:
                      scorePercent >= 80 ? "#dcfce7" : scorePercent >= 60 ? "#fef3c7" : "#fee2e2",
                    border:
                      scorePercent >= 80
                        ? "1px solid #86efac"
                        : scorePercent >= 60
                        ? "1px solid #fcd34d"
                        : "1px solid #fca5a5",
                    color:
                      scorePercent >= 80 ? "#166534" : scorePercent >= 60 ? "#92400e" : "#b91c1c",
                    borderRadius: 18,
                    padding: "12px 16px",
                    fontWeight: 800,
                  }}
                >
                  {submittedResult.score}/{quiz.length} • {scorePercent}% •{" "}
                  {getMasteryText(submittedResult.score, quiz.length)}
                </div>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              {quiz.map((question, questionIndex) => (
                <div
                  key={`${selectedLesson.id}-question-${questionIndex}`}
                  style={{
                    border: `1px solid ${pastel.border}`,
                    borderRadius: 20,
                    padding: 18,
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      color: pastel.title,
                      fontSize: 18,
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}
                  >
                    {questionIndex + 1}. {question.prompt}
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    {question.options.map((option, optionIndex) => {
                      const selected = selectedAnswers[questionIndex] === optionIndex;
                      const submitted = submittedResult?.submitted;
                      const selectedOriginalIndex = submittedResult?.submitted
                        ? question.originalOptionIndexes[submittedResult.answers[questionIndex]]
                        : null;
                      const thisOriginalIndex = question.originalOptionIndexes[optionIndex];
                      const isCorrect = submitted && thisOriginalIndex === question.answer;
                      const isWrongChosen =
                        submitted &&
                        selectedOriginalIndex !== null &&
                        submittedResult.answers[questionIndex] === optionIndex &&
                        selectedOriginalIndex !== question.answer;

                      return (
                        <button
                          key={`${selectedLesson.id}-${questionIndex}-${optionIndex}`}
                          onClick={() => chooseAnswer(questionIndex, optionIndex)}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            borderRadius: 16,
                            border: isCorrect
                              ? "1px solid #86efac"
                              : isWrongChosen
                              ? "1px solid #fca5a5"
                              : selected
                              ? "1px solid #c4b5fd"
                              : `1px solid ${pastel.border}`,
                            background: isCorrect
                              ? "#ecfdf5"
                              : isWrongChosen
                              ? "#fef2f2"
                              : selected
                              ? "#f5f3ff"
                              : "#ffffff",
                            color: pastel.title,
                            cursor: submitted ? "default" : "pointer",
                            fontWeight: selected ? 800 : 600,
                          }}
                          disabled={submitted}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {submittedResult?.submitted ? (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 14,
                        background: "#f8fafc",
                        border: `1px solid ${pastel.border}`,
                        color: "#475569",
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      Correct answer:{" "}
                      <strong>{question.options[question.originalOptionIndexes.indexOf(question.answer)]}</strong>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              {submittedResult?.submitted ? (
                <div
                  style={{
                    background: pastel.panelBlue,
                    border: `1px solid ${pastel.border}`,
                    borderRadius: 18,
                    padding: 16,
                    color: pastel.title,
                    lineHeight: 1.6,
                  }}
                >
                  Quiz already submitted for this lesson. Retakes are disabled. Review the correct
                  answers above and improve your work if needed.
                </div>
              ) : (
                <button
                  onClick={submitQuiz}
                  style={{
                    border: "none",
                    background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                    color: "#ffffff",
                    borderRadius: 16,
                    padding: "14px 18px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
