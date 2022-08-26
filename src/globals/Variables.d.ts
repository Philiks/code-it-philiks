/**
 * Map of variables with type `[varName: string]: any`.
 */
interface Variables {
  [variableName: string]: any;
}

/**
 * A callback function to *initialize*, *update*, and
 * *compare* the `Variables` field in a `LevelScene`.
 */
type VariableActionCallback = () => void;

export { VariableActionCallback };

export default Variables;
