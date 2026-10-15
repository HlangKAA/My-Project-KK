import { useState, useCallback } from "react";

// Wizard hints for error handling
const WIZARD_HINTS = {
  SyntaxError:
    "The magical scroll cannot read your runes! Check for missing brackets or typos.",
  NameError:
    "You are summoning a spirit (variable) that does not exist! Check your spelling.",
  IndentationError:
    "Your chanting rhythm is off! Python requires proper indentation (spaces).",
  TypeError:
    "You are mixing elements that do not blend! Check your data types.",
};

const usePythonInterpreter = () => {
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [wizardMessage, setWizardMessage] = useState("");

  const clearOutput = useCallback(() => {
    setOutput([]);
    setError(null);
    setWizardMessage("");
  }, []);

  const log = useCallback((msg) => {
    setOutput((prev) => [...prev, msg]);
  }, []);

  const builtinRead = (x) => {
    if (
      window.Sk.builtinFiles === undefined ||
      window.Sk.builtinFiles["files"][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return window.Sk.builtinFiles["files"][x];
  };

  // runCode takes the python code and an object of callbacks for the 'hero' module
  const runCode = useCallback((code, heroCallbacks = {}) => {
    if (!window.Sk) {
      setError("The magical engine (Skulpt) is not loaded!");
      return;
    }

    setIsRunning(true);
    setError(null);
    setWizardMessage("Casting spell...");

    window.Sk.configure({
      output: (text) => {
        log(text);
        if (heroCallbacks.__onPrint) {
          heroCallbacks.__onPrint(text);
        }
      },
      read: builtinRead,
      // Execution limit to prevent infinite loops (optional config)
      execLimit: 5000,
    });

    // Define the custom 'hero' module
    // We map the heroCallbacks (passed from React component) to Python functions
    const heroModule = new window.Sk.builtin.module();

    // Helper to create safe wrapper
    const createFunc = (jsFunc) =>
      new window.Sk.builtin.func(function (...args) {
        // Remap arguments from Python to JS
        const jsArgs = args.map((arg) => window.Sk.ffi.remapToJs(arg));
        // Call the JS callback
        const result = jsFunc ? jsFunc(...jsArgs) : null;
        // Remap result back to Python if needed (basic types only)
        return result !== undefined
          ? window.Sk.ffi.remapToPy(result)
          : window.Sk.builtin.none.none$;
      });

    heroModule.$d = {};

    // Explicitly binding known API methods to ensure safety
    const apiMethods = [
      "cast_color",
      "move_to_x",
      "move_right",
      "move_left",
      "move_up",
      "move_down",
      "move_to",
      "pick_up",
      "collect",
      "put_in",
      "deposit",
      "scan_light",
      "collect_fragment",
      "avoid_shadow",
      "say",
    ];

    apiMethods.forEach((method) => {
      if (heroCallbacks[method]) {
        heroModule.$d[method] = createFunc(heroCallbacks[method]);
      } else {
        // Default no-op if not provided
        heroModule.$d[method] = createFunc((...args) =>
          console.log(`[Hero] ${method} called (no callback provided)`, args),
        );
      }
    });

    // Also bind any extra callbacks dynamically
    Object.keys(heroCallbacks).forEach((key) => {
      if (!heroModule.$d[key]) {
        heroModule.$d[key] = createFunc(heroCallbacks[key]);
      }
    });

    window.Sk.builtins.hero = heroModule;

    const myPromise = window.Sk.misceval.asyncToPromise(function () {
      return window.Sk.importMainWithBody("<stdin>", false, code, true);
    });

    myPromise.then(
      function (mod) {
        setIsRunning(false);
        log("\n> Spell Execution Finished.");
        setWizardMessage("Spell execution complete!");
        if (heroCallbacks.__onSuccess) {
          heroCallbacks.__onSuccess(mod);
        }
      },
      function (err) {
        setIsRunning(false);
        const errStr = err.toString();
        log("\n[ERROR] " + errStr);
        setError(errStr);

        // Match wizard hint
        let foundHint =
          "Something is wrong with the magical flow... Check your code.";
        for (let key in WIZARD_HINTS) {
          if (errStr.includes(key)) {
            foundHint = WIZARD_HINTS[key];
            break;
          }
        }
        setWizardMessage(foundHint);
        if (heroCallbacks.__onError) {
          heroCallbacks.__onError(errStr);
        }
      },
    );

    return myPromise;
  }, []);

  return {
    output,
    error,
    isRunning,
    runCode,
    clearOutput,
    wizardMessage,
  };
};

export default usePythonInterpreter;
