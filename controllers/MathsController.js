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
    this.params["error"] = message;
    this.HttpContext.response.JSON(this.params);
  }

  validateParam(n) {
    const count = 2; //op & n
    if (Object.keys(this.params).length > count)
      return this.error("Theres too many parameters in the request");
    if (!this.hasN) return this.error("Parameter n is missing.");
    if (isNaN(n) || n <= 0 || !Number.isInteger(n))
      return this.error("Parameter n must be an integer > 0.");

    return true;
  }
  validateParams(x, y) {
    const count = 3; //op, x & y
    if (Object.keys(this.params).length > count)
      return this.error("Theres too many parameters in the request.");
    if (!this.hasX && !this.hasY)
      return this.error("Parameter x & y are missing.");
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
            return this.result(maths.division(x, y));
          break;

        //Modulo
        case "%":
          if (this.validateParams(x, y)) return this.result(maths.modulo(x, y));
          break;

        //Factorial
        case "!":
          if (this.validateParam(n)) return this.result(maths.factorial(n));
          break;

        //isPrime
        case "p":
          if (this.validateParam(n)) return this.result(maths.isPrime(n));
          break;

        //findPrime
        case "np":
          if (this.validateParam(n)) return this.result(maths.findPrime(n));
          break;

        default:
          return this.error(
            "Theres was problem with request. Please make sure [op] is a valid operator."
          );
      }
    } else return this.error("Parameter op is missing.");
  }

  help() {
    this.HttpContext.response.HTML(`
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GET: Maths endpoint</title>
  </head>
  <body>
    <h1>GET: Maths endpoint</h1>
    <h2>List of possible query strings:</h2>
    <fieldset style="font-weight: bold;">
      <p>? op = + & x = number & y = number
        <p>return {"op":"+","x": number, "y":number, "value": x+y}</p>
      </p>
      <p>? op = - & x = number & y = number
        <p>return {"op":"-","x": number, "y":number, "value": x-y}</p>
      </p>
      <p>? op = * & x = number & y = number
        <p>return {"op":"*","x": number, "y":number, "value": x*y}</p>
      </p>
      <p>? op = / & x = number & y = number
        <p>return {"op":"/","x": number, "y":number, "value": x/y}</p>
      </p>
      <p>? op = % & x = number & y = number
        <p>return {"op":"%","x": number, "y":number, "value": x%y}</p>
      </p>
      <p>? op = ! & n = integer
        <p>return {"op":"%","n": integer,"value": n!}</p>
      </p>
      <p>? op = p & n = integer
        <p>return {"op":"p","n": integer,"value": true if n is a prime number}</p>
      </p>
      <p>? op = np & n = integer
        <p>return {"op":"n","n": integer,"value": nth prime number}</p>
      </p>
    </fieldset>
    
    <h5>Math-API | Nicolas Ricci & Benjamin Gerard</h5>
  </body>
</html>

      `);
  }

  get() {
    if (this.HttpContext.path.queryString == "?") {
      return this.help();
    }
    this.calculate();
  }

  post() {
    return this.HttpContext.response.forbidden("Forbidden");
  }

  put() {
    return this.HttpContext.response.forbidden("Forbidden");
  }

  remove() {
    return this.HttpContext.response.forbidden("Forbidden");
  }
}
