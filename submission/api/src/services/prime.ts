import utils from "@/utils/validate_integer"

export class PrimeService {
  public validate(number: number): boolean {
    // Make sure the number is less than 2 as numbers less than 2 are not prime
    if (number < 2) return false

    if (!utils.isInteger(number)) return false

    // Cycles through all numbers from 2 to the square root of the number
    for (let i = 2; i <= Math.sqrt(number); i++) {
      // If the number is divisible by any other number, it is not prime.
      if (number % i === 0) {
        return false
      }
    }

    // If no divisor was found, the number is prime
    return true
  }
}
