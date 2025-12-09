/**
 * @interface ReusableModalProps
 * @description Defines the props for a reusable modal component used throughout the app.
 * It provides customizable styling, visibility control, and animation options for modals.
 *
 * @property {string} [reusableModalDesign] - Custom style for the modal content design.
 * @property {string} [reuseableModalContainerDesign] - Custom style for the modal container layout.
 * @property {boolean} visible - Controls whether the modal is visible or hidden.
 * @property {boolean} [transparent] - Makes the modal background transparent if true.
 * @property {'fade' | 'slide' | 'none'} [animationType] - Sets the modal's opening and closing animation type.
 * @property {string} [reuseableModalDesign] - (Deprecated: use reusableModalDesign instead) custom modal style.
 * @property {() => void} onRequestClose - Function triggered when the modal is requested to close.
 * @property {React.ReactNode} children - Elements to be rendered inside the modal.
 */

export interface ReusableModalProps {
  reusableModalDesign?: string;
  reuseableModalContainerDesign?: string;
  visible: boolean;
  transparent?: boolean;
  animationType?: "fade" | "slide" | "none";
  reuseableModalDesign?: string;
  onRequestClose: () => void;
  children: React.ReactNode;
}

export default {};
