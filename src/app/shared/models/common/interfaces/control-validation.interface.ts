export interface IControlValidation {
  minlength: number;
  maxlength: number;
  pattern?: string;
  max?: number;
  min?: number;
}