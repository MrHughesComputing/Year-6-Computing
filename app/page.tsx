"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Lesson = {
  id: number;
  week: number;
  term: "Summer Term 1" | "Summer Term 2";
  title: string;
  shortTitle: string;
  description: string;
  objective: string;
  overview: string;
  whyItMatters: string;
  vocab: string[];
  scratchSteps: string[];
  scratchTask: string;
  keyQuestion: string;
  misconception: string;
  correctOutcome: string;
  wrongOutcome: string;
  scratchLink: string;
};

type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
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
};

type StartMode = "existing" | "new";

const CLASS_OPTIONS = [
  "Year 5 Eucalyptus",
  "Year 5 Hawthorne",
  "Year 5 Sycamore",
  "Year 5 Willow",
];

const REGISTRY_KEY = "year5-pupil-registry";
const CURRENT_PROFILE_KEY = "year5-current-profile";

const lessons: Lesson[] = [
  {
    id: 1,
    week: 1,
    term: "Summer Term 1",
    title: "Conditions",
    shortTitle: "Intro to Conditions",
    description: "Understanding conditions in Scratch",
    objective: "I can explain that a condition can be true or false.",
    overview:
      "A condition is a check in a program. It asks whether something is true or false before the program decides what to do next.",
    whyItMatters:
      "Conditions help programs make decisions instead of doing the same thing every time.",
    vocab: ["condition", "true", "false", "decision"],
    scratchSteps: [
      "Open Scratch and choose a sprite.",
      "Add an event block such as ‘when green flag clicked’.",
      "Find a control block that uses a condition.",
      "Choose a sensing or operator block that can be true or false.",
      "Place that condition into the control block.",
      "Add an action inside the block, such as ‘say hello’.",
      "Run the program and test when the condition is true.",
      "Change the condition and test it again.",
    ],
    scratchTask:
      "Create a sprite action that only happens when one rule is true.",
    keyQuestion:
      "How does a computer know whether it should carry out an action?",
    misconception:
      "A condition is not the action itself. It is the check that decides whether the action should happen.",
    correctOutcome: "The sprite only acts when the condition is true.",
    wrongOutcome:
      "The sprite acts all the time or never acts because the condition is not being checked properly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 2,
    week: 2,
    term: "Summer Term 1",
    title: "If... Then...",
    shortTitle: "Single Outcome Selection",
    description: "Using if... then... in Scratch",
    objective:
      "I can use an if... then... block to make a simple decision.",
    overview:
      "An if... then... block tells the computer to do something only when a condition is true.",
    whyItMatters:
      "This lets programs respond to events instead of always running in the same way.",
    vocab: ["if", "then", "selection", "action"],
    scratchSteps: [
      "Open Scratch and pick a sprite.",
      "Add ‘when green flag clicked’.",
      "Drag in an ‘if... then...’ block from Control.",
      "Choose a condition, such as ‘touching edge?’ or ‘key space pressed?’.",
      "Place the condition inside the if space.",
      "Add one action inside the then section, such as ‘say hello’.",
      "Run the code and check what happens when the condition is true.",
      "Test what happens when the condition is false.",
    ],
    scratchTask: "Make a sprite react only when a condition is true.",
    keyQuestion:
      "What happens if the condition is false in an if... then... block?",
    misconception:
      "Nothing inside the block runs when the condition is false.",
    correctOutcome: "The action happens only when the rule is met.",
    wrongOutcome:
      "The action happens all the time because the condition is missing or outside the block.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 3,
    week: 3,
    term: "Summer Term 1",
    title: "If... Then... Else...",
    shortTitle: "Branching",
    description: "Using two outcomes in Scratch",
    objective: "I can create code with two different outcomes.",
    overview:
      "If... then... else... lets a program choose between two different outcomes.",
    whyItMatters:
      "It allows a program to respond differently when the answer is right or wrong.",
    vocab: ["else", "branch", "outcome", "selection"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Use ‘ask ... and wait’ to collect an answer.",
      "Drag in an ‘if... then... else...’ block.",
      "Compare the answer to the correct response using an operator block.",
      "Put the check inside the if space.",
      "Add a correct message in the then section.",
      "Add a different message in the else section.",
      "Test with both a correct and incorrect answer.",
    ],
    scratchTask:
      "Create a quiz-style response with a correct and incorrect outcome.",
    keyQuestion: "Why is the else part useful in a program?",
    misconception:
      "Else is not repetition. It is the second outcome when the condition is false.",
    correctOutcome:
      "The program gives one response for true and another for false.",
    wrongOutcome:
      "The same response appears every time because both outcomes are not set clearly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 4,
    week: 4,
    term: "Summer Term 1",
    title: "Selection + Loops",
    shortTitle: "Continuous Checking",
    description: "Using selection inside repetition",
    objective:
      "I can explain how a program keeps checking for an event.",
    overview:
      "A loop repeats code. A condition inside a loop can be checked again and again.",
    whyItMatters:
      "This is how games and interactive projects respond in real time.",
    vocab: ["loop", "repeat", "forever", "check"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Add a ‘forever’ block from Control.",
      "Place an ‘if... then...’ block inside the forever loop.",
      "Choose a condition such as ‘key pressed?’ or ‘touching mouse-pointer?’.",
      "Place the condition inside the if section.",
      "Add an action inside the then section.",
      "Run the program and try the action several times.",
      "Notice that the condition is checked continuously.",
    ],
    scratchTask:
      "Create a script that keeps checking for a key press or collision.",
    keyQuestion:
      "Why does a program need to keep checking some conditions repeatedly?",
    misconception:
      "One check is not enough in a live program. It must keep checking while the program runs.",
    correctOutcome:
      "The sprite responds as soon as the event happens.",
    wrongOutcome:
      "The program only checks once because the selection block is not inside a loop.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 5,
    week: 5,
    term: "Summer Term 1",
    title: "Asking Questions",
    shortTitle: "Input + Decisions",
    description: "Using ask/answer with conditions",
    objective:
      "I can use a player’s answer inside a condition.",
    overview:
      "The ask block collects input from the user. The answer block stores what the user typed.",
    whyItMatters:
      "It makes projects interactive because the computer responds to the player.",
    vocab: ["input", "answer", "question", "response"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Use ‘ask ... and wait’ to ask a question.",
      "Add an ‘if... then... else...’ block.",
      "Use an operator block to compare ‘answer’ to the correct response.",
      "Place that comparison into the if space.",
      "Add feedback in the then section.",
      "Add different feedback in the else section.",
      "Test with several different answers.",
    ],
    scratchTask:
      "Create one interactive question using ask, answer, and a condition.",
    keyQuestion: "How does Scratch remember what the user typed?",
    misconception:
      "The answer block stores the user response, not the question itself.",
    correctOutcome:
      "The program checks the user’s answer and gives suitable feedback.",
    wrongOutcome:
      "The program cannot judge the response because the answer block was not used correctly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 6,
    week: 6,
    term: "Summer Term 1",
    title: "Designing a Quiz",
    shortTitle: "Planning Logic",
    description: "Planning a Scratch quiz before coding",
    objective:
      "I can plan the steps and decisions for a quiz program.",
    overview:
      "Planning means deciding the order, questions, and outcomes before coding.",
    whyItMatters:
      "Good plans make programs easier to build, test, and improve.",
    vocab: ["algorithm", "plan", "flowchart", "sequence"],
    scratchSteps: [
      "Write the first question you want to ask.",
      "Write the correct answer beside it.",
      "Decide what should happen when the answer is correct.",
      "Decide what should happen when the answer is wrong.",
      "Repeat this for a second question.",
      "Put the steps into a simple order or flowchart.",
      "Only after planning, open Scratch.",
      "Build the first question from your plan.",
    ],
    scratchTask:
      "Plan a short quiz with at least two questions before opening Scratch.",
    keyQuestion:
      "Why is it useful to plan a program before writing code?",
    misconception:
      "Planning is not a delay. It helps avoid mistakes and messy code later.",
    correctOutcome:
      "The program is easier to build because the logic is already clear.",
    wrongOutcome:
      "The coding becomes confusing because the steps were not planned first.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 7,
    week: 7,
    term: "Summer Term 1",
    title: "Debugging",
    shortTitle: "Fixing Logic",
    description: "Finding and fixing errors in selection code",
    objective:
      "I can test a program and fix logic mistakes.",
    overview:
      "Debugging means finding and correcting mistakes in a program.",
    whyItMatters:
      "Testing and debugging help programs work reliably.",
    vocab: ["debug", "error", "test", "fix"],
    scratchSteps: [
      "Run the program once and watch carefully.",
      "Test a correct answer or true condition.",
      "Test an incorrect answer or false condition.",
      "Notice which part is not behaving properly.",
      "Check the condition block first.",
      "Check whether blocks are in the correct order.",
      "Change one thing at a time.",
      "Retest after each change.",
    ],
    scratchTask:
      "Test a quiz or decision program and fix at least one logic error.",
    keyQuestion:
      "What should you do first when your program does not behave as expected?",
    misconception:
      "Debugging does not mean starting again. It means finding the exact problem and fixing it.",
    correctOutcome:
      "The program works after careful testing and small changes.",
    wrongOutcome:
      "The problem remains because the code was changed without testing methodically.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 8,
    week: 1,
    term: "Summer Term 2",
    title: "Build a Quiz",
    shortTitle: "First Working Question",
    description: "Creating the first question in a quiz",
    objective:
      "I can build a working quiz question using input and selection.",
    overview:
      "This lesson combines asking questions, checking answers, and giving feedback into one working quiz item.",
    whyItMatters:
      "It turns separate coding skills into a real project.",
    vocab: ["quiz", "input", "condition", "feedback"],
    scratchSteps: [
      "Open Scratch and add ‘when green flag clicked’.",
      "Ask your first question.",
      "Use answer in a comparison block.",
      "Place the comparison inside an ‘if... then... else...’ block.",
      "Write correct feedback in then.",
      "Write incorrect feedback in else.",
      "Test with a right answer.",
      "Test with a wrong answer.",
    ],
    scratchTask:
      "Create one complete quiz question with feedback for correct and incorrect answers.",
    keyQuestion:
      "What parts are needed for one working quiz question?",
    misconception:
      "A good first version should be simple and complete before extra features are added.",
    correctOutcome:
      "The quiz question works fully from question to feedback.",
    wrongOutcome:
      "The question appears, but the answer is not checked properly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 9,
    week: 2,
    term: "Summer Term 2",
    title: "Expand the Quiz",
    shortTitle: "Multiple Questions",
    description: "Adding more questions and structure",
    objective:
      "I can extend my quiz to include multiple questions.",
    overview:
      "Expanding means adding more content while keeping the code clear and organised.",
    whyItMatters:
      "A larger project still needs to stay easy to understand and test.",
    vocab: ["extend", "structure", "score", "sequence"],
    scratchSteps: [
      "Finish one working question first.",
      "Copy the structure for a second question.",
      "Change the wording and correct answer.",
      "Add new correct and incorrect feedback.",
      "Place the second question after the first one.",
      "Check that the order still makes sense.",
      "Test both questions.",
      "Improve any part that feels unclear.",
    ],
    scratchTask:
      "Add at least one more question and keep the quiz organised.",
    keyQuestion:
      "How can you make your quiz bigger without making it messy?",
    misconception:
      "Copying code is useful only if it stays organised and is edited carefully.",
    correctOutcome:
      "The quiz has more than one question and still makes sense.",
    wrongOutcome:
      "The quiz becomes confusing because the questions are out of order or not edited correctly.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 10,
    week: 3,
    term: "Summer Term 2",
    title: "Testing and Improving",
    shortTitle: "Refining Accuracy",
    description: "Checking quiz logic and improving reliability",
    objective:
      "I can test my project and improve weak areas.",
    overview:
      "Testing checks whether a project works in different situations, not just once.",
    whyItMatters:
      "Reliable projects work for different answers and different users.",
    vocab: ["test", "improve", "logic", "edge case"],
    scratchSteps: [
      "Run the quiz from the beginning.",
      "Try a correct answer.",
      "Try an incorrect answer.",
      "Try an unusual answer, such as a capital letter or space.",
      "Record what went wrong.",
      "Fix one issue at a time.",
      "Retest after each fix.",
      "Ask a partner to test it too.",
    ],
    scratchTask:
      "Test each question and improve any part that does not work correctly.",
    keyQuestion:
      "Why should you test a project in more than one way?",
    misconception:
      "One successful test does not prove the project is fully correct.",
    correctOutcome:
      "The project works more reliably because it has been tested properly.",
    wrongOutcome:
      "Hidden mistakes remain because testing was too limited.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 11,
    week: 4,
    term: "Summer Term 2",
    title: "Enhancing the Program",
    shortTitle: "Better User Experience",
    description: "Improving the design and feedback of the quiz",
    objective:
      "I can improve my project so it is clearer and more enjoyable.",
    overview:
      "Enhancing means improving the experience for the person using the program.",
    whyItMatters:
      "A good program should be correct, clear, and enjoyable to use.",
    vocab: ["enhance", "design", "user experience", "feedback"],
    scratchSteps: [
      "Look at the instructions on screen.",
      "Make them shorter and clearer.",
      "Improve the feedback messages.",
      "Check that the questions are easy to read.",
      "Add useful visual or sound feedback.",
      "Keep the code organised while improving the design.",
      "Test whether the quiz is easier to use.",
      "Ask a partner what could still be better.",
    ],
    scratchTask:
      "Improve the design, messages, and feedback in your quiz.",
    keyQuestion:
      "What makes a program easier and more enjoyable to use?",
    misconception:
      "Improvement is not just decoration. It should help the user understand and use the program better.",
    correctOutcome:
      "The project feels clearer and more polished for the user.",
    wrongOutcome:
      "Extra features are added, but the quiz becomes less clear or harder to use.",
    scratchLink: "https://scratch.mit.edu/",
  },
  {
    id: 12,
    week: 5,
    term: "Summer Term 2",
    title: "Consolidation",
    shortTitle: "Final Project Review",
    description: "Finishing, reviewing, and evaluating the quiz",
    objective:
      "I can complete my quiz and reflect on what I learned.",
    overview:
      "Consolidation means bringing your learning together and reviewing your final project.",
    whyItMatters:
      "Reflection helps you identify strengths and next steps.",
    vocab: ["evaluate", "review", "complete", "reflect"],
    scratchSteps: [
      "Run your project from start to finish.",
      "Check that each question works properly.",
      "Check the messages and feedback.",
      "Fix any final errors.",
      "Review your vocabulary and coding choices.",
      "Decide one strength in your project.",
      "Decide one thing you would improve next time.",
      "Save and present your final version.",
    ],
    scratchTask:
      "Finish your project and identify one strength and one next step.",
    keyQuestion:
      "How do you know whether your final project is successful?",
    misconception:
      "Finished does not mean perfect. Reflection is about judging quality and identifying improvements.",
    correctOutcome:
      "The final project is complete and the pupil can explain its strengths.",
    wrongOutcome:
      "The project is rushed and not reviewed carefully before being called finished.",
    scratchLink: "https://scratch.mit.edu/",
  },
];

const quizBank: Record<number, QuizQuestion[]> = {
  1: [
    {
      prompt: "What is a condition in a program?",
      options: [
        "A check that is either true or false",
        "A way to draw a sprite",
        "A sound effect in Scratch",
        "A type of background",
      ],
      answer: 0,
    },
    {
      prompt: "What does a program use a condition for?",
      options: [
        "To decide what should happen next",
        "To make the stage bigger",
        "To save the project automatically",
        "To colour the blocks",
      ],
      answer: 0,
    },
    {
      prompt: "Which of these can be true or false?",
      options: [
        "Is the sprite touching the edge?",
        "Move 10 steps",
        "Play a drum sound",
        "Switch costume",
      ],
      answer: 0,
    },
    {
      prompt: "Which Scratch block category often uses conditions?",
      options: ["Control", "Looks only", "Sound only", "My Blocks only"],
      answer: 0,
    },
    {
      prompt: "If a condition is false, what should happen in a simple if block?",
      options: [
        "The action inside should not happen",
        "The action should always happen",
        "Scratch should close",
        "The sprite should delete itself",
      ],
      answer: 0,
    },
    {
      prompt: "Which word best describes what a condition does?",
      options: ["Checks", "Paints", "Prints", "Copies"],
      answer: 0,
    },
    {
      prompt: "Why are conditions useful in games and quizzes?",
      options: [
        "They let the program respond differently",
        "They make code invisible",
        "They replace all other blocks",
        "They stop all testing",
      ],
      answer: 0,
    },
    {
      prompt: "Which pair best matches a condition?",
      options: ["True and false", "Up and down", "Fast and slow", "Big and small"],
      answer: 0,
    },
    {
      prompt: "What is the mistake in thinking a condition is the action itself?",
      options: [
        "A condition checks; it does not do the action",
        "A condition is always a sprite",
        "A condition is always a sound",
        "A condition is always a loop",
      ],
      answer: 0,
    },
    {
      prompt: "Which example is most like a condition?",
      options: [
        "Is the space key pressed?",
        "Say hello for 2 seconds",
        "Turn 15 degrees",
        "Change size by 10",
      ],
      answer: 0,
    },
  ],
  2: [
    {
      prompt: "What does an if... then... block do?",
      options: [
        "Runs code only if a condition is true",
        "Runs code forever without checking",
        "Always gives two answers",
        "Stores a score",
      ],
      answer: 0,
    },
    {
      prompt: "What happens if the condition is false in an if... then... block?",
      options: [
        "Nothing inside the block happens",
        "Everything inside happens twice",
        "Scratch crashes",
        "The sprite disappears",
      ],
      answer: 0,
    },
    {
      prompt: "Which block would fit inside the if part?",
      options: [
        "touching edge?",
        "say hello",
        "move 10 steps",
        "switch costume",
      ],
      answer: 0,
    },
    {
      prompt: "Which block could go inside the then section?",
      options: [
        "say hello",
        "touching mouse-pointer?",
        "key space pressed?",
        "answer = yes",
      ],
      answer: 0,
    },
    {
      prompt: "Why is if... then... called selection?",
      options: [
        "Because the program selects whether to act",
        "Because it selects a new sprite colour",
        "Because it sorts files",
        "Because it changes the stage name",
      ],
      answer: 0,
    },
    {
      prompt: "Which sentence is correct?",
      options: [
        "The action happens only when the rule is met",
        "The action happens whether the rule is true or false",
        "The action always repeats forever",
        "The action removes the condition",
      ],
      answer: 0,
    },
    {
      prompt: "What is needed for an if... then... block to work properly?",
      options: [
        "A true/false condition",
        "A microphone",
        "A second computer",
        "A printed worksheet",
      ],
      answer: 0,
    },
    {
      prompt: "Which situation suits if... then...?",
      options: [
        "Make a sprite jump if the space key is pressed",
        "Always move the sprite 10 steps",
        "Play music the whole time",
        "Change every backdrop at once",
      ],
      answer: 0,
    },
    {
      prompt: "What common mistake causes the action to happen all the time?",
      options: [
        "The condition is missing or placed wrongly",
        "The sprite is too small",
        "The stage is white",
        "The project is saved",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main purpose of this lesson?",
      options: [
        "To make one simple decision in code",
        "To draw quiz backgrounds",
        "To animate costumes only",
        "To use sound effects only",
      ],
      answer: 0,
    },
  ],
  3: [
    {
      prompt: "What does an if... then... else... block allow a program to do?",
      options: [
        "Choose between two outcomes",
        "Play two sounds at once",
        "Delete two sprites",
        "Open two projects",
      ],
      answer: 0,
    },
    {
      prompt: "When does the else part run?",
      options: [
        "When the condition is false",
        "When the condition is true",
        "Before the project starts",
        "Only when Scratch saves",
      ],
      answer: 0,
    },
    {
      prompt: "Why is else useful in a quiz?",
      options: [
        "It gives a different response for a wrong answer",
        "It changes the font",
        "It makes the sprite invisible",
        "It stops all input",
      ],
      answer: 0,
    },
    {
      prompt: "Which block helps gather the player's response?",
      options: [
        "ask ... and wait",
        "move 10 steps",
        "hide",
        "next costume",
      ],
      answer: 0,
    },
    {
      prompt: "What should go inside the condition space?",
      options: [
        "A check such as answer = correct response",
        "A whole paragraph of text",
        "A backdrop",
        "A sound file",
      ],
      answer: 0,
    },
    {
      prompt: "Which sentence is true?",
      options: [
        "If gives one path, else gives the other path",
        "Else repeats the same action again",
        "Else is used only for movement",
        "Else works without a condition",
      ],
      answer: 0,
    },
    {
      prompt: "What is branching in this lesson?",
      options: [
        "The program splitting into two possible outcomes",
        "Drawing tree branches",
        "Using two sprites together",
        "Adding extra costumes",
      ],
      answer: 0,
    },
    {
      prompt: "Which response is best for the then section?",
      options: [
        "Correct! Well done.",
        "Nothing at all",
        "Change the background every second forever",
        "Delete the stage",
      ],
      answer: 0,
    },
    {
      prompt: "Which response is best for the else section?",
      options: [
        "Not quite. Try again.",
        "Always say Correct!",
        "Ignore the answer completely",
        "Never show any message",
      ],
      answer: 0,
    },
    {
      prompt: "What misunderstanding should pupils avoid?",
      options: [
        "Else is not repetition; it is the false outcome",
        "Else means the program stops forever",
        "Else means make a new sprite",
        "Else is the same as repeat",
      ],
      answer: 0,
    },
  ],
  4: [
    {
      prompt: "Why do we put selection inside a loop?",
      options: [
        "So the condition can be checked again and again",
        "So the code becomes invisible",
        "So the sprite never moves",
        "So the quiz cannot start",
      ],
      answer: 0,
    },
    {
      prompt: "Which loop is often used for continuous checking?",
      options: ["forever", "wait", "say", "hide"],
      answer: 0,
    },
    {
      prompt: "What happens if an if block is not inside a loop in a live program?",
      options: [
        "It may only check once",
        "It checks all the time anyway",
        "It creates new sprites automatically",
        "It adds sound effects by itself",
      ],
      answer: 0,
    },
    {
      prompt: "Which situation needs continuous checking?",
      options: [
        "Seeing whether a key is pressed during a game",
        "Saving a project name once",
        "Typing a title once",
        "Choosing a sprite once",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main job of the forever block here?",
      options: [
        "To keep repeating the check",
        "To stop the program",
        "To change the backdrop once",
        "To add a new costume",
      ],
      answer: 0,
    },
    {
      prompt: "Which condition could be useful in a loop?",
      options: [
        "touching mouse-pointer?",
        "say hello",
        "play sound until done",
        "go to x: y:",
      ],
      answer: 0,
    },
    {
      prompt: "Why do games often need loops and selection together?",
      options: [
        "Because they must respond in real time",
        "Because they never use conditions",
        "Because they only need backgrounds",
        "Because loops replace all actions",
      ],
      answer: 0,
    },
    {
      prompt: "What would the sprite do if the condition becomes true while the loop runs?",
      options: [
        "Respond as soon as it is checked",
        "Ignore it forever",
        "Delete the project",
        "Turn off Scratch",
      ],
      answer: 0,
    },
    {
      prompt: "What common mistake stops fast responses?",
      options: [
        "Putting the if block outside the loop",
        "Giving the sprite a name",
        "Using a colourful backdrop",
        "Saving the project",
      ],
      answer: 0,
    },
    {
      prompt: "What is being checked repeatedly in this lesson?",
      options: [
        "A condition",
        "A printed worksheet",
        "A mouse battery",
        "A font choice",
      ],
      answer: 0,
    },
  ],
  5: [
    {
      prompt: "What does the ask block do?",
      options: [
        "Collects input from the user",
        "Changes the sprite colour",
        "Saves the project",
        "Deletes wrong answers",
      ],
      answer: 0,
    },
    {
      prompt: "Where is the user's typed response stored?",
      options: ["In the answer block", "In the backdrop", "In the sprite name", "In the green flag"],
      answer: 0,
    },
    {
      prompt: "Why is the ask and answer system useful?",
      options: [
        "It makes the project interactive",
        "It makes every sprite larger",
        "It stops code from running",
        "It removes the need for conditions",
      ],
      answer: 0,
    },
    {
      prompt: "What should you compare to the correct response?",
      options: ["answer", "stage size", "costume number", "mouse pointer x"],
      answer: 0,
    },
    {
      prompt: "Which block structure works well after asking a question?",
      options: [
        "if... then... else...",
        "forever only",
        "repeat without a condition",
        "hide and show only",
      ],
      answer: 0,
    },
    {
      prompt: "What is the best way to respond to a correct answer?",
      options: [
        "Give suitable positive feedback",
        "Ignore it",
        "Delete the sprite",
        "Close the project",
      ],
      answer: 0,
    },
    {
      prompt: "What is the best way to respond to a wrong answer?",
      options: [
        "Give different feedback",
        "Always say the answer is correct",
        "Stop the computer",
        "Remove the question",
      ],
      answer: 0,
    },
    {
      prompt: "What should pupils avoid misunderstanding?",
      options: [
        "The answer block stores the response, not the question",
        "The answer block stores a costume",
        "The answer block stores a backdrop",
        "The answer block stores the sprite name only",
      ],
      answer: 0,
    },
    {
      prompt: "Which example uses input correctly?",
      options: [
        "Ask the player a question and compare answer to the correct word",
        "Ask a question and never use the answer",
        "Type the answer into the sprite name",
        "Use only a move block",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main idea of this lesson?",
      options: [
        "Using player input in a condition",
        "Drawing characters",
        "Recording voice only",
        "Making new costumes only",
      ],
      answer: 0,
    },
  ],
  6: [
    {
      prompt: "What does planning a quiz mean?",
      options: [
        "Deciding the order, questions, and outcomes before coding",
        "Colouring the stage before coding",
        "Using random blocks without thinking",
        "Typing code as fast as possible",
      ],
      answer: 0,
    },
    {
      prompt: "Why is planning useful?",
      options: [
        "It makes the program easier to build and test",
        "It removes the need for code",
        "It always fixes every bug",
        "It replaces Scratch",
      ],
      answer: 0,
    },
    {
      prompt: "Which should be planned before coding a question?",
      options: [
        "The correct answer",
        "The laptop battery level",
        "The classroom door colour",
        "The font on the keyboard",
      ],
      answer: 0,
    },
    {
      prompt: "What should you also plan besides the questions?",
      options: [
        "What happens for correct and wrong answers",
        "How many desks are in the room",
        "What the teacher is wearing",
        "How long the mouse cable is",
      ],
      answer: 0,
    },
    {
      prompt: "Which word means a set of steps for a program?",
      options: ["algorithm", "speaker", "printer", "screen saver"],
      answer: 0,
    },
    {
      prompt: "What could help show the order of a quiz before coding?",
      options: ["A flowchart", "A loudspeaker", "A calculator", "A charger"],
      answer: 0,
    },
    {
      prompt: "What is a poor way to begin a larger project?",
      options: [
        "Coding without deciding the logic first",
        "Writing the questions down first",
        "Thinking about the order first",
        "Checking the outcomes first",
      ],
      answer: 0,
    },
    {
      prompt: "Why is planning not a waste of time?",
      options: [
        "It helps avoid confusion later",
        "It stops pupils from learning",
        "It deletes all mistakes automatically",
        "It is only for adults",
      ],
      answer: 0,
    },
    {
      prompt: "What should happen after the planning stage?",
      options: [
        "Build the first question from the plan",
        "Ignore the plan completely",
        "Print the screen and stop",
        "Delete the notes",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main purpose of this lesson?",
      options: [
        "To plan quiz logic clearly before coding",
        "To add many sounds at random",
        "To decorate the stage only",
        "To make the project run forever with no input",
      ],
      answer: 0,
    },
  ],
  7: [
    {
      prompt: "What does debugging mean?",
      options: [
        "Finding and fixing mistakes in a program",
        "Drawing bugs on the stage",
        "Starting every project again",
        "Saving the project twice",
      ],
      answer: 0,
    },
    {
      prompt: "What should you do first when a program behaves unexpectedly?",
      options: [
        "Test carefully and look for the problem",
        "Delete all the code at once",
        "Close Scratch immediately",
        "Add more sprites",
      ],
      answer: 0,
    },
    {
      prompt: "Why is it useful to test both correct and incorrect answers?",
      options: [
        "So you can see whether both outcomes work",
        "So you can make the quiz longer",
        "So you can avoid using conditions",
        "So you can remove all feedback",
      ],
      answer: 0,
    },
    {
      prompt: "Which part should you check first in selection code?",
      options: [
        "The condition block",
        "The colour of the stage",
        "The size of the teacher's screen",
        "The computer wallpaper",
      ],
      answer: 0,
    },
    {
      prompt: "Why should you change one thing at a time while debugging?",
      options: [
        "So you know what fixed the problem",
        "So the program becomes confusing",
        "So no testing is needed",
        "So you can avoid thinking",
      ],
      answer: 0,
    },
    {
      prompt: "What is a sensible debugging habit?",
      options: [
        "Retest after each change",
        "Never run the code",
        "Guess without looking",
        "Keep adding blocks randomly",
      ],
      answer: 0,
    },
    {
      prompt: "What is a logic error?",
      options: [
        "The code runs, but not in the way you intended",
        "The screen is dusty",
        "The mouse is unplugged",
        "The backdrop is pink",
      ],
      answer: 0,
    },
    {
      prompt: "What misunderstanding should pupils avoid?",
      options: [
        "Debugging is not starting again; it is fixing the real problem",
        "Debugging means never testing",
        "Debugging means adding more sounds",
        "Debugging means avoiding mistakes forever",
      ],
      answer: 0,
    },
    {
      prompt: "Which is the best example of methodical debugging?",
      options: [
        "Test, spot the issue, change one part, and test again",
        "Delete the whole project immediately",
        "Ask Scratch to fix everything by itself",
        "Keep clicking random blocks",
      ],
      answer: 0,
    },
    {
      prompt: "What is the goal of debugging?",
      options: [
        "To make the program work reliably",
        "To make the quiz impossible",
        "To remove all conditions",
        "To stop pupils from checking work",
      ],
      answer: 0,
    },
  ],
  8: [
    {
      prompt: "What makes one complete quiz question work?",
      options: [
        "A question, an answer check, and feedback",
        "A backdrop and a sound only",
        "A sprite and a costume only",
        "A loop with no condition",
      ],
      answer: 0,
    },
    {
      prompt: "What should happen after the player types an answer?",
      options: [
        "The program should check it",
        "The project should close",
        "The sprite should disappear",
        "The code should delete itself",
      ],
      answer: 0,
    },
    {
      prompt: "Which block helps compare the answer with the correct response?",
      options: [
        "An operator comparison block",
        "A motion block",
        "A looks block only",
        "A sound block only",
      ],
      answer: 0,
    },
    {
      prompt: "Which control block is most suitable for two outcomes?",
      options: ["if... then... else...", "repeat 10", "wait 1 second", "hide"],
      answer: 0,
    },
    {
      prompt: "What is good advice for a first working version?",
      options: [
        "Keep it simple but complete",
        "Add every feature at once",
        "Never test it",
        "Avoid feedback messages",
      ],
      answer: 0,
    },
    {
      prompt: "What does the then section usually contain?",
      options: [
        "Correct feedback",
        "A new login page",
        "A computer restart",
        "A deleted sprite",
      ],
      answer: 0,
    },
    {
      prompt: "What does the else section usually contain?",
      options: [
        "Incorrect feedback",
        "The exact same message every time",
        "No response at all",
        "A stage size change",
      ],
      answer: 0,
    },
    {
      prompt: "Why is this lesson important?",
      options: [
        "It combines earlier skills into a real project",
        "It removes the need for planning",
        "It stops pupils from improving",
        "It only teaches decoration",
      ],
      answer: 0,
    },
    {
      prompt: "What should you test when your first question is built?",
      options: [
        "A right answer and a wrong answer",
        "Only the green flag",
        "Only the backdrop",
        "Only the sprite size",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main aim of this lesson?",
      options: [
        "To build one working quiz question",
        "To create ten backdrops",
        "To make the sprite dance forever",
        "To avoid using input",
      ],
      answer: 0,
    },
  ],
  9: [
    {
      prompt: "What does it mean to expand a quiz?",
      options: [
        "Add more questions while keeping it organised",
        "Make the text bigger only",
        "Delete the first question",
        "Remove all conditions",
      ],
      answer: 0,
    },
    {
      prompt: "What should you finish before adding another question?",
      options: [
        "One working question",
        "Every costume in Scratch",
        "A soundtrack",
        "The printed display board",
      ],
      answer: 0,
    },
    {
      prompt: "Why can copying code be useful?",
      options: [
        "It helps build the next question faster if edited carefully",
        "It means no thinking is needed",
        "It fixes all bugs by itself",
        "It removes the need for testing",
      ],
      answer: 0,
    },
    {
      prompt: "What must you change after copying a question?",
      options: [
        "The wording and correct answer",
        "The school name",
        "The stage size",
        "The mouse cable",
      ],
      answer: 0,
    },
    {
      prompt: "Why is structure important in a bigger quiz?",
      options: [
        "So the order still makes sense",
        "So nobody can read it",
        "So the quiz becomes confusing",
        "So it stops after one question",
      ],
      answer: 0,
    },
    {
      prompt: "What should you test after adding a second question?",
      options: [
        "Both questions",
        "Only the title",
        "Only the first sprite costume",
        "Only the backdrop colour",
      ],
      answer: 0,
    },
    {
      prompt: "What is one danger when extending a project?",
      options: [
        "It can become messy if not organised",
        "It always becomes impossible",
        "It can never be tested",
        "It removes the first question automatically",
      ],
      answer: 0,
    },
    {
      prompt: "Which word best matches making a project bigger?",
      options: ["extend", "erase", "shrink", "freeze"],
      answer: 0,
    },
    {
      prompt: "What common mistake should pupils avoid?",
      options: [
        "Copying code and forgetting to edit it properly",
        "Testing both questions",
        "Keeping the code in order",
        "Using clear feedback",
      ],
      answer: 0,
    },
    {
      prompt: "What is the goal of this lesson?",
      options: [
        "To add more quiz questions clearly and sensibly",
        "To replace all questions with sounds",
        "To remove all structure",
        "To stop after one question forever",
      ],
      answer: 0,
    },
  ],
  10: [
    {
      prompt: "Why should a project be tested in more than one way?",
      options: [
        "Because one successful test does not prove everything works",
        "Because testing is only for adults",
        "Because the first test is always perfect",
        "Because testing deletes mistakes automatically",
      ],
      answer: 0,
    },
    {
      prompt: "Which is a good test for a quiz project?",
      options: [
        "Try correct, incorrect, and unusual answers",
        "Only click the green flag once",
        "Only look at the backdrop",
        "Only test the project title",
      ],
      answer: 0,
    },
    {
      prompt: "What is an edge case?",
      options: [
        "An unusual input that still needs to work",
        "A type of sprite",
        "A kind of background",
        "A sound effect",
      ],
      answer: 0,
    },
    {
      prompt: "Why might capital letters matter in testing?",
      options: [
        "Because the program may react differently to them",
        "Because capital letters break every computer",
        "Because Scratch cannot display them",
        "Because they change the sprite colour",
      ],
      answer: 0,
    },
    {
      prompt: "What should you do after finding a problem?",
      options: [
        "Fix one issue at a time and retest",
        "Delete everything",
        "Ignore it",
        "Add three more questions immediately",
      ],
      answer: 0,
    },
    {
      prompt: "Why is partner testing useful?",
      options: [
        "Another person may spot problems you missed",
        "It removes the need for your own testing",
        "It makes the code shorter",
        "It changes the class name",
      ],
      answer: 0,
    },
    {
      prompt: "What is the purpose of recording what went wrong?",
      options: [
        "It helps you improve the right part",
        "It makes the project slower",
        "It stops the quiz from running",
        "It changes the sprite costume",
      ],
      answer: 0,
    },
    {
      prompt: "What does improving reliability mean?",
      options: [
        "Making the project work in different situations",
        "Making the project louder",
        "Making the stage brighter",
        "Adding more random blocks",
      ],
      answer: 0,
    },
    {
      prompt: "Which statement is true?",
      options: [
        "Testing is part of making a strong project",
        "Testing is only needed after publishing",
        "Testing should be avoided",
        "Testing replaces coding",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main focus of this lesson?",
      options: [
        "Checking the quiz carefully and improving weak areas",
        "Changing every sprite name",
        "Using only movement blocks",
        "Removing all feedback",
      ],
      answer: 0,
    },
  ],
  11: [
    {
      prompt: "What does enhancing a program mean?",
      options: [
        "Improving how clear and enjoyable it is to use",
        "Making it longer without thinking",
        "Deleting working parts",
        "Removing all instructions",
      ],
      answer: 0,
    },
    {
      prompt: "What is user experience?",
      options: [
        "How the program feels for the person using it",
        "The colour of the teacher's desk",
        "The age of the laptop",
        "The size of the mouse mat",
      ],
      answer: 0,
    },
    {
      prompt: "Which improvement is most helpful?",
      options: [
        "Making instructions clearer",
        "Adding confusing text everywhere",
        "Hiding all feedback",
        "Removing all questions",
      ],
      answer: 0,
    },
    {
      prompt: "Why is feedback important in a quiz?",
      options: [
        "It helps the user understand what happened",
        "It changes the school logo",
        "It stops the answer being checked",
        "It removes the need for testing",
      ],
      answer: 0,
    },
    {
      prompt: "What should you think about before adding extra sounds or visuals?",
      options: [
        "Do they help the user?",
        "Are they the brightest possible colours?",
        "Can they replace all the code?",
        "Will they remove the questions?",
      ],
      answer: 0,
    },
    {
      prompt: "What is a poor improvement choice?",
      options: [
        "Adding features that make the quiz harder to understand",
        "Using clearer messages",
        "Checking readability",
        "Asking a partner for feedback",
      ],
      answer: 0,
    },
    {
      prompt: "What should happen to the code while improving design?",
      options: [
        "It should stay organised",
        "It should become messy",
        "It should be hidden from everyone",
        "It should be deleted",
      ],
      answer: 0,
    },
    {
      prompt: "Why should the questions be easy to read?",
      options: [
        "Because users need to understand them quickly",
        "Because Scratch cannot show text otherwise",
        "Because big text fixes logic errors",
        "Because reading is not important",
      ],
      answer: 0,
    },
    {
      prompt: "What misunderstanding should pupils avoid?",
      options: [
        "Improvement is not just decoration; it should help the user",
        "Improvement means adding random sounds only",
        "Improvement means changing everything at once",
        "Improvement means never asking for feedback",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main aim of this lesson?",
      options: [
        "To make the quiz clearer and more polished",
        "To remove all messages",
        "To avoid thinking about the user",
        "To stop testing completely",
      ],
      answer: 0,
    },
  ],
  12: [
    {
      prompt: "What does consolidation mean in this unit?",
      options: [
        "Bringing learning together and reviewing the final project",
        "Starting again from lesson one",
        "Only changing colours",
        "Removing all quiz questions",
      ],
      answer: 0,
    },
    {
      prompt: "What should you do before calling the project finished?",
      options: [
        "Run it from start to finish and check it carefully",
        "Close it immediately",
        "Delete the feedback",
        "Ignore all mistakes",
      ],
      answer: 0,
    },
    {
      prompt: "Why is reflection useful?",
      options: [
        "It helps you spot strengths and next steps",
        "It stops you from improving",
        "It replaces testing",
        "It changes the code automatically",
      ],
      answer: 0,
    },
    {
      prompt: "What is a strength in a final project?",
      options: [
        "Something that works well",
        "A random mistake",
        "An empty section",
        "A missing answer check",
      ],
      answer: 0,
    },
    {
      prompt: "What is a next step?",
      options: [
        "Something you would improve in future",
        "The same thing as deleting the project",
        "A new computer",
        "A printed title page",
      ],
      answer: 0,
    },
    {
      prompt: "What should you check near the end?",
      options: [
        "Questions, feedback, and any remaining errors",
        "Only the class name",
        "Only the font size",
        "Only the device wallpaper",
      ],
      answer: 0,
    },
    {
      prompt: "Which sentence is true?",
      options: [
        "Finished does not always mean perfect",
        "Finished always means there is nothing to improve",
        "Finished means it was never tested",
        "Finished means the code is invisible",
      ],
      answer: 0,
    },
    {
      prompt: "Why should pupils review their coding choices?",
      options: [
        "So they can explain how the project works",
        "So they can remove all logic",
        "So they can avoid discussing learning",
        "So they can stop the quiz running",
      ],
      answer: 0,
    },
    {
      prompt: "What should a final version be ready for?",
      options: [
        "Saving and presenting",
        "Deleting immediately",
        "Never being opened again",
        "Having all conditions removed",
      ],
      answer: 0,
    },
    {
      prompt: "What is the main purpose of this lesson?",
      options: [
        "To finish the quiz and reflect on the learning",
        "To start a different unit without review",
        "To replace every question with animation",
        "To skip evaluation",
      ],
      answer: 0,
    },
  ],
};

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
  shadow: "0 10px 30px rgba(148, 163, 184, 0.14)",
};

function slugifyName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normaliseName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function buildStorageKey(className: string, studentName: string) {
  return `year5-${className}-${slugifyName(studentName)}`;
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
  const alreadyExists = existing.some(
    (item) => item.storageKey === profile.storageKey
  );
  if (!alreadyExists) {
    saveRegistry([...existing, profile].sort((a, b) =>
      a.studentName.localeCompare(b.studentName)
    ));
  }
}

function removeProfileFromRegistry(profile: LearnerProfile) {
  const existing = getRegistry();
  const filtered = existing.filter(
    (item) => item.storageKey !== profile.storageKey
  );
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

function applyQuizOrder(questions: QuizQuestion[], quizOrder: number[][]) {
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

export default function Home() {
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [quizState, setQuizState] = useState<Record<number, QuizResult>>({});
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number[]>>(
    {}
  );
  const [screenshots, setScreenshots] = useState<ScreenshotMap>({});
  const [quizOrderMap, setQuizOrderMap] = useState<QuizOrderMap>({});
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  const [startMode, setStartMode] = useState<StartMode>("existing");
  const [setupClass, setSetupClass] = useState<string>("");
  const [setupStudentName, setSetupStudentName] = useState("");
  const [existingClass, setExistingClass] = useState<string>(CLASS_OPTIONS[0]);
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
      } catch {
        localStorage.removeItem(CURRENT_PROFILE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!profile) return;

    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));

    const savedProgress = localStorage.getItem(`${profile.storageKey}-progress`);
    const savedQuiz = localStorage.getItem(`${profile.storageKey}-quiz-results`);
    const savedScreenshots = localStorage.getItem(
      `${profile.storageKey}-screenshots`
    );
    const savedQuizOrder = localStorage.getItem(
      `${profile.storageKey}-quiz-order`
    );

    setCompleted(savedProgress ? JSON.parse(savedProgress) : []);
    setQuizState(savedQuiz ? JSON.parse(savedQuiz) : {});
    setCurrentAnswers({});
    setScreenshots(savedScreenshots ? JSON.parse(savedScreenshots) : {});
    setQuizOrderMap(safeParseQuizOrderMap(savedQuizOrder));
    setSelectedLessonId(1);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(
      `${profile.storageKey}-progress`,
      JSON.stringify(completed)
    );
  }, [completed, profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(
      `${profile.storageKey}-quiz-results`,
      JSON.stringify(quizState)
    );
  }, [quizState, profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(
      `${profile.storageKey}-screenshots`,
      JSON.stringify(screenshots)
    );
  }, [screenshots, profile]);

  useEffect(() => {
    if (!profile) return;
    localStorage.setItem(
      `${profile.storageKey}-quiz-order`,
      JSON.stringify(quizOrderMap)
    );
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
            question.options.every((_, optionIndex) =>
              orderForQuestion.includes(optionIndex)
            )
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
  const selectedScreenshot = screenshots[selectedLesson.id];
  const scorePercent = submittedResult
    ? Math.round((submittedResult.score / quiz.length) * 100)
    : 0;

  const groupedLessons = useMemo(
    () => ({
      "Summer Term 1": lessons.filter(
        (lesson) => lesson.term === "Summer Term 1"
      ),
      "Summer Term 2": lessons.filter(
        (lesson) => lesson.term === "Summer Term 2"
      ),
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

    const storageKey = buildStorageKey(setupClass, cleanName);
    const newProfile: LearnerProfile = {
      className: setupClass,
      studentName: cleanName,
      storageKey,
    };

    addProfileToRegistry(newProfile);
    setRegistry(getRegistry());
    setProfile(newProfile);
    setExistingClass(setupClass);
  };

  const openExistingPupil = (selectedProfile: LearnerProfile) => {
    setProfile(selectedProfile);
    setSetupClass(selectedProfile.className);
    setSetupStudentName(selectedProfile.studentName);
  };

  const switchLearner = () => {
    setProfile(null);
    setCurrentAnswers({});
    setQuizOrderMap({});
    setStartMode("existing");
    setRegistry(getRegistry());
  };

  const deleteExistingPupil = (selectedProfile: LearnerProfile) => {
    const confirmed = window.confirm(
      `Delete saved data for ${selectedProfile.studentName} in ${selectedProfile.className}? This will remove progress, quiz scores, and screenshots from this browser.`
    );

    if (!confirmed) return;

    localStorage.removeItem(`${selectedProfile.storageKey}-progress`);
    localStorage.removeItem(`${selectedProfile.storageKey}-quiz-results`);
    localStorage.removeItem(`${selectedProfile.storageKey}-quiz-order`);
    localStorage.removeItem(`${selectedProfile.storageKey}-screenshots`);

    removeProfileFromRegistry(selectedProfile);
    const updated = getRegistry();
    setRegistry(updated);

    if (profile?.storageKey === selectedProfile.storageKey) {
      localStorage.removeItem(CURRENT_PROFILE_KEY);
      setProfile(null);
    }
  };

  const markComplete = () => {
    if (!completed.includes(selectedLesson.id)) {
      setCompleted((prev) => [...prev, selectedLesson.id]);
    }
  };

  const resetCurrentLearnerProgress = () => {
    if (!profile) return;

    setCompleted([]);
    setQuizState({});
    setCurrentAnswers({});
    setScreenshots({});
    setQuizOrderMap({});

    localStorage.removeItem(`${profile.storageKey}-progress`);
    localStorage.removeItem(`${profile.storageKey}-quiz-results`);
    localStorage.removeItem(`${profile.storageKey}-quiz-order`);
    localStorage.removeItem(`${profile.storageKey}-screenshots`);
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
      const originalIndex = question.originalOptionIndexes?.[displayedIndex] ?? displayedIndex;

      if (originalIndex === question.answer) {
        score += 1;
      }
    });

    setQuizState((prev) => ({
      ...prev,
      [selectedLesson.id]: {
        submitted: true,
        score,
        answers: selectedAnswers,
      },
    }));
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
  };

  if (!profile) {
    return (
      <main
        style={{
          padding: 32,
          fontFamily: "Inter, Arial, sans-serif",
          maxWidth: 1100,
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
                color: "#7c3aed",
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              APSR Computing Platform
            </div>
            <h1
              style={{
                fontSize: 46,
                lineHeight: 1.05,
                margin: "8px 0 10px",
                color: pastel.title,
              }}
            >
              Welcome to Year 5 Computing
            </h1>
            <p style={{ fontSize: 20, margin: 0 }}>
              Choose an existing pupil or create a new pupil learning space on
              this browser.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 22,
              flexWrap: "wrap",
            }}
          >
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
                    : "#ffffff",
                fontWeight: 800,
                fontSize: 16,
                color: pastel.title,
                cursor: "pointer",
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
                    : "#ffffff",
                fontWeight: 800,
                fontSize: 16,
                color: pastel.title,
                cursor: "pointer",
              }}
            >
              New Pupil
            </button>
          </div>

          {startMode === "existing" ? (
            <div
              style={{
                background: "rgba(255,255,255,0.78)",
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  marginTop: 0,
                  marginBottom: 14,
                  color: pastel.title,
                }}
              >
                Choose Existing Pupil
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {CLASS_OPTIONS.map((classOption) => {
                  const isActive = existingClass === classOption;
                  return (
                    <button
                      key={classOption}
                      onClick={() => setExistingClass(classOption)}
                      style={{
                        padding: "18px 16px",
                        borderRadius: 18,
                        border: isActive
                          ? "1px solid #c4b5fd"
                          : `1px solid ${pastel.border}`,
                        background: isActive
                          ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                          : "#ffffff",
                        fontWeight: 800,
                        fontSize: 18,
                        color: pastel.title,
                        cursor: "pointer",
                      }}
                    >
                      {classOption}
                    </button>
                  );
                })}
              </div>

              {existingPupilsForClass.length === 0 ? (
                <div
                  style={{
                    border: `1px dashed ${pastel.border}`,
                    borderRadius: 18,
                    padding: 22,
                    background: "#ffffff",
                    fontSize: 17,
                    color: "#64748b",
                  }}
                >
                  No saved pupils yet for {existingClass}.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {existingPupilsForClass.map((savedPupil) => (
                    <div
                      key={savedPupil.storageKey}
                      style={{
                        background: "#ffffff",
                        border: `1px solid ${pastel.border}`,
                        borderRadius: 18,
                        padding: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            color: pastel.title,
                          }}
                        >
                          {savedPupil.studentName}
                        </div>
                        <div style={{ fontSize: 14, color: "#64748b" }}>
                          {savedPupil.className}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          onClick={() => openExistingPupil(savedPupil)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: 14,
                            border: "none",
                            background:
                              "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                            color: "white",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Open
                        </button>

                        <button
                          onClick={() => deleteExistingPupil(savedPupil)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: 14,
                            border: "1px solid #fecdd3",
                            background: pastel.roseSoft,
                            color: pastel.rose,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                Saved pupils are stored only on this browser and device.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.78)",
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  marginTop: 0,
                  marginBottom: 14,
                  color: pastel.title,
                }}
              >
                Create New Pupil
              </h2>

              <h3
                style={{
                  fontSize: 22,
                  marginTop: 0,
                  marginBottom: 12,
                  color: pastel.title,
                }}
              >
                Step 1: Choose class
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {CLASS_OPTIONS.map((classOption) => {
                  const isActive = setupClass === classOption;
                  return (
                    <button
                      key={classOption}
                      onClick={() => setSetupClass(classOption)}
                      style={{
                        padding: "18px 16px",
                        borderRadius: 18,
                        border: isActive
                          ? "1px solid #c4b5fd"
                          : `1px solid ${pastel.border}`,
                        background: isActive
                          ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                          : "#ffffff",
                        fontWeight: 800,
                        fontSize: 18,
                        color: pastel.title,
                        cursor: "pointer",
                      }}
                    >
                      {classOption}
                    </button>
                  );
                })}
              </div>

              <h3
                style={{
                  fontSize: 22,
                  marginTop: 0,
                  marginBottom: 12,
                  color: pastel.title,
                }}
              >
                Step 2: Enter name
              </h3>

              <input
                type="text"
                value={setupStudentName}
                onChange={(e) => setSetupStudentName(e.target.value)}
                placeholder="Type first name and surname"
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 16,
                  border: `1px solid ${pastel.border}`,
                  fontSize: 18,
                  marginBottom: 20,
                  outline: "none",
                }}
              />

              <button
                onClick={startNewSession}
                style={{
                  padding: "16px 22px",
                  borderRadius: 16,
                  border: "none",
                  background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                Create Pupil Space
              </button>

              <p
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                Progress, quiz scores, and screenshots will be saved separately
                for this pupil on this browser.
              </p>
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
        maxWidth: 1520,
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
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "#7c3aed",
                fontWeight: 700,
                letterSpacing: 0.3,
                marginBottom: 8,
              }}
            >
              APSR Computing Platform
            </div>
            <h1
              style={{
                fontSize: 52,
                lineHeight: 1.05,
                margin: "0 0 10px",
                color: pastel.title,
              }}
            >
              APSR Year 5 Computing
            </h1>
            <p style={{ fontSize: 22, margin: "0 0 10px" }}>
              Selection in Scratch
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
            </div>
          </div>

          <div
            style={{
              minWidth: 320,
              background: "rgba(255,255,255,0.7)",
              border: `1px solid ${pastel.border}`,
              borderRadius: 22,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                marginBottom: 10,
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
                  background:
                    "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                }}
              />
            </div>
            <div style={{ fontSize: 14, marginTop: 10, color: "#64748b" }}>
              {completed.length} of {lessons.length} lessons marked complete
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

          {(["Summer Term 1", "Summer Term 2"] as const).map((term) => (
            <div key={term} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#7c3aed",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                {term}
              </div>

              {groupedLessons[term].map((lesson) => {
                const active = selectedLessonId === lesson.id;
                const done = completed.includes(lesson.id);
                const hasScreenshot = Boolean(screenshots[lesson.id]);
                const hasQuizScore = Boolean(quizState[lesson.id]?.submitted);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: 16,
                      marginBottom: 10,
                      borderRadius: 18,
                      border: active
                        ? "1px solid #c4b5fd"
                        : `1px solid ${pastel.border}`,
                      background: active
                        ? "linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%)"
                        : pastel.panel,
                      cursor: "pointer",
                      boxShadow: active
                        ? "0 8px 22px rgba(124, 58, 237, 0.12)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 6,
                      }}
                    >
                      Week {lesson.week} • {lesson.shortTitle}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: pastel.title,
                      }}
                    >
                      {lesson.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        marginTop: 6,
                        color: pastel.text,
                      }}
                    >
                      {lesson.description}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 10,
                      }}
                    >
                      {done && (
                        <span
                          style={{
                            color: pastel.green,
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          ✓ Completed
                        </span>
                      )}
                      {hasQuizScore && (
                        <span
                          style={{
                            color: "#1d4ed8",
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          Quiz: {quizState[lesson.id].score}/10
                        </span>
                      )}
                      {hasScreenshot && (
                        <span
                          style={{
                            color: "#b45309",
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          📷 Screenshot added
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <section style={{ display: "grid", gap: 24 }}>
          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
                alignItems: "start",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: pastel.panelLilac,
                    color: "#6d28d9",
                    fontWeight: 800,
                    fontSize: 13,
                    marginBottom: 12,
                  }}
                >
                  {selectedLesson.term} • Week {selectedLesson.week}
                </div>
                <h2
                  style={{
                    fontSize: 48,
                    lineHeight: 1.05,
                    margin: "0 0 10px",
                    color: pastel.title,
                  }}
                >
                  {selectedLesson.title}
                </h2>
                <p style={{ fontSize: 22, margin: 0 }}>
                  {selectedLesson.description}
                </p>
              </div>

              {submittedResult?.submitted && (
                <div
                  style={{
                    background: pastel.greenSoft,
                    color: "#065f46",
                    borderRadius: 18,
                    padding: 18,
                    minWidth: 220,
                    border: "1px solid #a7f3d0",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    Quiz Submitted
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>
                    {submittedResult.score}/10
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {scorePercent}% • No retakes for this lesson
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            <div
              style={{
                background: pastel.panelBlue,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 26,
                boxShadow: pastel.shadow,
              }}
            >
              <h3
                style={{
                  fontSize: 32,
                  marginTop: 0,
                  marginBottom: 12,
                  color: pastel.title,
                }}
              >
                Learn This First
              </h3>
              <div style={{ fontSize: 18, lineHeight: 1.7 }}>
                <p>
                  <strong>What is this topic?</strong>
                  <br />
                  {selectedLesson.overview}
                </p>
                <p>
                  <strong>Why does it matter?</strong>
                  <br />
                  {selectedLesson.whyItMatters}
                </p>
                <p>
                  <strong>Key question</strong>
                  <br />
                  {selectedLesson.keyQuestion}
                </p>
                <p>
                  <strong>Watch out for this</strong>
                  <br />
                  {selectedLesson.misconception}
                </p>
              </div>
            </div>

            <div
              style={{
                background: pastel.panelMint,
                border: `1px solid ${pastel.border}`,
                borderRadius: 24,
                padding: 26,
                boxShadow: pastel.shadow,
              }}
            >
              <h3
                style={{
                  fontSize: 32,
                  marginTop: 0,
                  marginBottom: 12,
                  color: pastel.title,
                }}
              >
                Step-by-Step in Scratch
              </h3>
              <ol
                style={{
                  paddingLeft: 24,
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.75,
                }}
              >
                {selectedLesson.scratchSteps.map((step, index) => (
                  <li key={index} style={{ marginBottom: 10 }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            style={{
              background: pastel.panel,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 34,
                    marginTop: 0,
                    marginBottom: 8,
                    color: pastel.title,
                  }}
                >
                  Lesson Quiz
                </h3>
                <p style={{ fontSize: 18, margin: 0 }}>
                  10 questions based on this lesson. Once submitted, the quiz is
                  locked and cannot be retaken.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span
                  style={{
                    background: pastel.accentSoft,
                    color: pastel.accent,
                    borderRadius: 999,
                    padding: "10px 14px",
                    fontWeight: 800,
                  }}
                >
                  10 Questions
                </span>
                {submittedResult?.submitted && (
                  <span
                    style={{
                      background: pastel.greenSoft,
                      color: "#065f46",
                      borderRadius: 999,
                      padding: "10px 14px",
                      fontWeight: 800,
                    }}
                  >
                    Submitted
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
              {quiz.map((question, qIndex) => (
                <div
                  key={qIndex}
                  style={{
                    border: `1px solid ${pastel.border}`,
                    borderRadius: 18,
                    padding: 20,
                    background: qIndex % 2 === 0 ? "#fff" : "#fcfcff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 19,
                      marginBottom: 14,
                      color: pastel.title,
                    }}
                  >
                    {qIndex + 1}. {question.prompt}
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    {question.options.map((option, oIndex) => {
                      const chosen = selectedAnswers[qIndex] === oIndex;
                      const locked = submittedResult?.submitted;
                      const originalOptionIndex =
                        question.originalOptionIndexes?.[oIndex] ?? oIndex;
                      const isCorrect =
                        submittedResult?.submitted &&
                        originalOptionIndex === question.answer;
                      const isWrongChoice =
                        submittedResult?.submitted &&
                        chosen &&
                        originalOptionIndex !== question.answer;

                      return (
                        <button
                          key={oIndex}
                          onClick={() => chooseAnswer(qIndex, oIndex)}
                          disabled={locked}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            borderRadius: 14,
                            border: isCorrect
                              ? "1px solid #86efac"
                              : isWrongChoice
                              ? "1px solid #fca5a5"
                              : chosen
                              ? "1px solid #c4b5fd"
                              : `1px solid ${pastel.border}`,
                            background: isCorrect
                              ? "#ecfdf5"
                              : isWrongChoice
                              ? "#fef2f2"
                              : chosen
                              ? "#f5f3ff"
                              : "#ffffff",
                            cursor: locked ? "default" : "pointer",
                            fontSize: 17,
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{option}</div>
                          {submittedResult?.submitted && isCorrect && (
                            <div
                              style={{
                                fontSize: 13,
                                marginTop: 6,
                                color: "#15803d",
                                fontWeight: 700,
                              }}
                            >
                              Correct answer
                            </div>
                          )}
                          {submittedResult?.submitted && isWrongChoice && (
                            <div
                              style={{
                                fontSize: 13,
                                marginTop: 6,
                                color: "#dc2626",
                                fontWeight: 700,
                              }}
                            >
                              Your answer
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 16, color: "#64748b" }}>
                {submittedResult?.submitted
                  ? `Final score: ${submittedResult.score}/10. Review the green correct answers and any red mistakes to see where to improve.`
                  : "Choose one answer for each question, then submit once."}
              </div>

              <button
                onClick={submitQuiz}
                disabled={submittedResult?.submitted}
                style={{
                  padding: "14px 20px",
                  borderRadius: 14,
                  border: "none",
                  background: submittedResult?.submitted
                    ? "#cbd5e1"
                    : "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                  color: "white",
                  fontWeight: 800,
                  cursor: submittedResult?.submitted ? "default" : "pointer",
                  fontSize: 17,
                }}
              >
                {submittedResult?.submitted ? "Quiz Submitted" : "Submit Quiz"}
              </button>
            </div>

            {submittedResult?.submitted && (
              <div
                style={{
                  marginTop: 20,
                  background: pastel.panelSky,
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 22,
                    color: pastel.title,
                    marginBottom: 8,
                  }}
                >
                  Quiz Result
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${pastel.border}`,
                      borderRadius: 999,
                      padding: "10px 14px",
                      fontWeight: 800,
                      color: pastel.title,
                    }}
                  >
                    Score: {submittedResult.score}/10
                  </span>
                  <span
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${pastel.border}`,
                      borderRadius: 999,
                      padding: "10px 14px",
                      fontWeight: 800,
                      color: pastel.title,
                    }}
                  >
                    Percentage: {scorePercent}%
                  </span>
                </div>
                <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.6 }}>
                  Look back through the quiz. Green answers show the correct
                  responses. Red answers show any choices that need improving.
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: pastel.panelSoft,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <h3
              style={{
                fontSize: 34,
                marginTop: 0,
                marginBottom: 12,
                color: pastel.title,
              }}
            >
              Scratch Task
            </h3>
            <p style={{ fontSize: 20, lineHeight: 1.7, marginTop: 0 }}>
              {selectedLesson.scratchTask}
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <a
                href={selectedLesson.scratchLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "14px 20px",
                  background: pastel.navy,
                  color: "white",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Open Scratch in a new tab
              </a>

              <button
                onClick={markComplete}
                style={{
                  padding: "14px 20px",
                  background: pastel.green,
                  color: "white",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                Mark Lesson Complete
              </button>
            </div>
          </div>

          <div
            style={{
              background: pastel.panelPeach,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 28,
              boxShadow: pastel.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 32,
                    marginTop: 0,
                    marginBottom: 8,
                    color: pastel.title,
                  }}
                >
                  Project Screenshot Upload
                </h3>
                <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0 }}>
                  Upload a screenshot of your Scratch work for this lesson.
                  This stays on this browser only.
                </p>
              </div>

              {selectedScreenshot && (
                <span
                  style={{
                    background: pastel.amberSoft,
                    color: "#92400e",
                    borderRadius: 999,
                    padding: "10px 14px",
                    fontWeight: 800,
                  }}
                >
                  Screenshot saved
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <label
                style={{
                  display: "inline-block",
                  padding: "14px 20px",
                  background: "white",
                  color: pastel.title,
                  borderRadius: 14,
                  border: `1px solid ${pastel.border}`,
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Choose Image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleScreenshotUpload}
                  style={{ display: "none" }}
                />
              </label>

              {selectedScreenshot && (
                <button
                  onClick={clearScreenshot}
                  style={{
                    padding: "14px 20px",
                    background: "#fff1f2",
                    color: pastel.rose,
                    borderRadius: 14,
                    border: "1px solid #fecdd3",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  Remove Screenshot
                </button>
              )}
            </div>

            <div style={{ fontSize: 14, color: "#78716c", marginBottom: 18 }}>
              Accepted: PNG, JPG, WEBP • Maximum size: 2MB
            </div>

            {selectedScreenshot ? (
              <div
                style={{
                  background: "white",
                  border: `1px solid ${pastel.border}`,
                  borderRadius: 20,
                  padding: 16,
                }}
              >
                <img
                  src={selectedScreenshot}
                  alt={`Scratch project screenshot for ${selectedLesson.title}`}
                  style={{
                    width: "100%",
                    maxHeight: 500,
                    objectFit: "contain",
                    borderRadius: 14,
                    display: "block",
                    background: "#f8fafc",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  border: "2px dashed #fdba74",
                  borderRadius: 20,
                  padding: 28,
                  background: "rgba(255,255,255,0.7)",
                  color: "#9a3412",
                  fontSize: 17,
                }}
              >
                No screenshot uploaded yet for this lesson.
              </div>
            )}
          </div>

          <div
            style={{
              background: pastel.panelLilac,
              border: `1px solid ${pastel.border}`,
              borderRadius: 24,
              padding: 26,
              boxShadow: pastel.shadow,
            }}
          >
            <h3
              style={{
                fontSize: 30,
                marginTop: 0,
                marginBottom: 14,
                color: pastel.title,
              }}
            >
              Key Vocabulary
            </h3>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {selectedLesson.vocab.map((word) => (
                <span
                  key={word}
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: `1px solid ${pastel.border}`,
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontSize: 17,
                    fontWeight: 700,
                    color: pastel.title,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
