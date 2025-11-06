/**
 * @interface ReusableModalProps
 * @description Defines the props for a reusable modal button component.
 * It allows customizing the modal design, button text, and button behavior.
 *
 * @property {string} [reuseableButtonDesign] - Optional custom style or class for the button design.
 * @property {string} textButtonDesign - Style or class applied to the button inside the button.
 * @property {string} textButton - The text displayed on the button.
 * @property {() => void} onPress - Function executed when the button is pressed.
*/

export interface ReusableButtonProps{
    reuseableButtonDesign?: string;
    textButtonDesign: string;
    textButton: string;
    onPress: () => void;
}

export default {}