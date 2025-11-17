/**
 * Utility function to convert a string to Title Case.
 * Transforms "hello world" into "Hello World".
 * * @param {string} str - The raw input string.
 * @returns {string} The formatted string with the first letter of each word capitalized.
 */
const toTitleCase = (str) => {
    // Guard clause: Safe check.
    // Returns immediately if input is null, undefined, or empty to prevent crashing.
    if (!str) return str;

    return str.replace(
        // Regex Explanation:
        // \w  -> Matches the first character of a word (alphanumeric).
        // \S* -> Matches the rest of the word (any non-whitespace characters).
        // g   -> Global flag: ensures we find ALL words in the string, not just the first one.
        /\w\S*/g, 
        (txt) => {
            // Transformation Logic:
            // 1. Take the first letter (index 0) and uppercase it.
            // 2. Take the rest of the word (substr from index 1) and lowercase it.
            //    (This fixes mixed-case typos like "jAVascript" -> "Javascript")
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
};

export default toTitleCase;