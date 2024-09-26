import * as maths from "../mathUtilities.js";
import Controller from "./Controller.js";

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext);
    this.params = HttpContext.path.params;
    this.hasN = "n" in this.params;
    this.hasX = "x" in this.params;
    this.hasY = "y" in this.params;
    this.hasOp = "op" in this.params;
  }

  result(value) {
    if (isNaN(value)) {
      value = "NaN";
    }

    if (value === Infinity) {
      value = "Infinity";
    }

    this.params.value = value;
    this.HttpContext.response.JSON(this.params);
  }

  error(message) {
    this.HttpContext.response.JSON(message);
  }

  validateParam(n) {
    const count = 2; //op & n
    if (Object.keys(this.params).length > count)
      return this.error("Theres too many parameters in the request");
    if (!this.hasN) return this.error("Parameter n is missing.");
    if (isNaN(n) || n < 0)
      return this.error("Parameter n is not a valid number.");

    return true;
  }
  validateParams(x, y) {
    const count = 3; //op, x & y
    if (Object.keys(this.params).length > count)
      return this.error("Theres too many parameters in the request");
    if (!this.hasX && !this.hasY) return this.error("Parameter x & y are missing.");
    if (!this.hasX) return this.error("Parameter x is missing.");
    if (!this.hasY) return this.error("Parameter y is missing.");
    if (isNaN(x)) return this.error("Parameter x is not a valid number.");
    if (isNaN(y)) return this.error("Parameter y is not a valid number.");
    return true;
  }

  calculate() {
    let op = this.params.op;
    let x = parseFloat(this.params.x);
    let y = parseFloat(this.params.y);
    let n = parseFloat(this.params.n);

    if (op === " ") {
      op = "+";
    }
    if (this.hasOp) {
      switch (op) {
        //Addition
        case "+":
          if (this.validateParams(x, y))
            return this.result(maths.addition(x, y));
          break;

        //Substract
        case "-":
          if (this.validateParams(x, y))
            return this.result(maths.substract(x, y));
          break;

        //Multiply
        case "*":
          if (this.validateParams(x, y))
            return this.result(maths.multiply(x, y));
          break;

        //Division
        case "/":
          if (this.validateParams(x, y))
            return this.result(maths.substract(x, y));
          break;

        //Modulo
        case "%":
          if (this.validateParams(x, y)) return this.result(maths.modulo(x, y));
          break;

        //Factorial
        case "!":
          if (this.validateParam(n)) return this.result(maths.factorial(n));
          break;

        default:
          return this.error(
            "Theres was problem with request. Please make sure [op] is a valid operator."
          );
      }
    } else return this.error("Parameter op is missing.");
  }
  get() {
    // if(this.HttpContext.path.params == '?'){}
    this.calculate();
  }
}
