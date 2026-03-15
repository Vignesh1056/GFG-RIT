self.onmessage = function (e) {
  const { code, stdin } = e.data;

  try {
    let output = "";
    const logs = [];

    const fakeConsole = {
      log: (...args) => {
        const line = args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ");
        logs.push(line);
      }
    };

    // Parse stdin lines into JS values
    function parseValue(str) {
      str = str.trim();
      try { return JSON.parse(str); } catch (_) { return str; }
    }

    const lines = stdin.split("\n").map(parseValue);

    // Build a sandboxed function scope
    const fn = new Function("console", code + `
;
// Auto-detect and call the defined function with parsed args
const fnNames = Object.getOwnPropertyNames(this).filter(k => typeof eval(k) === 'function' && k !== 'Function');
`);

    // We use a different approach: eval in a with-block to capture function names
    let result;
    const scope = { console: fakeConsole };

    // Eval the user code to define functions
    const evalFn = new Function("console", `
      ${code}
      // Try to find and call the function
      const defined = [];
      try { if (typeof twoSum === 'function') defined.push(['twoSum', twoSum]); } catch(_) {}
      try { if (typeof addTwoNumbers === 'function') defined.push(['addTwoNumbers', addTwoNumbers]); } catch(_) {}
      try { if (typeof lengthOfLongestSubstring === 'function') defined.push(['lengthOfLongestSubstring', lengthOfLongestSubstring]); } catch(_) {}
      try { if (typeof solve === 'function') defined.push(['solve', solve]); } catch(_) {}
      return defined;
    `);

    const defined = evalFn(fakeConsole);

    if (defined.length > 0) {
      const [name, func] = defined[0];
      result = func(...lines);
      if (logs.length === 0) {
        // function returned a value, print it
        output = typeof result === "object" ? JSON.stringify(result) : String(result);
      } else {
        output = logs.join("\n");
      }
    } else {
      // No known function found, just eval and capture console.log output
      const plainEval = new Function("console", code);
      plainEval(fakeConsole);
      output = logs.join("\n");
    }

    self.postMessage({ type: "success", output: output.trim() });
  } catch (error) {
    self.postMessage({ type: "error", error: error.toString() });
  }
};
