import Char "mo:core/Char";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  type Cashflow = {
    amount : Float;
    year : Nat;
  };

  type Investment = {
    initialInvestment : Float;
    interestRate : Float;
    years : Nat;
    cashflows : [Cashflow];
    compoundingFrequency : ?Nat;
    inflationRate : ?Float;
    taxRate : ?Float;
  };

  type FutureValueResult = {
    nominalFutureValue : Float;
    realFutureValue : Float;
    preTaxFutureValue : Float;
    afterTaxFutureValue : Float;
    principalWithoutInterest : Float;
  };

  public query func futureValue(investment : Investment) : async FutureValueResult {
    let rate = investment.interestRate;
    let n = investment.years;
    let freq = switch (investment.compoundingFrequency) {
      case (null) { 1 };
      case (?f) { f };
    };
    let nominalInterestFactor = (1.0 + (rate / freq.toFloat())) ** (n * freq).toFloat();
    let nominalFutureValue = investment.initialInvestment * nominalInterestFactor;

    let principalWithoutInterest = investment.initialInvestment + calcCashflowSum(investment.cashflows);

    let inflationRate = switch (investment.inflationRate) {
      case (null) { 0.0 };
      case (?r) { r };
    };

    let realInterestRate = if (inflationRate > 0.0) {
      (1.0 + rate) / (1.0 + inflationRate) - 1.0;
    } else {
      rate;
    };

    let realInterestFactor = (1.0 + realInterestRate / freq.toFloat()) ** (n * freq).toFloat();
    let realFutureValue = investment.initialInvestment * realInterestFactor;

    let preTaxFutureValue = nominalFutureValue + calcAdjustedCashflows(investment.cashflows, rate, n, freq);

    let taxRate = switch (investment.taxRate) {
      case (null) { 0.0 };
      case (?r) { r };
    };
    let capitalGains = preTaxFutureValue - principalWithoutInterest;
    let afterTaxFutureValue = preTaxFutureValue - (capitalGains * taxRate);

    {
      nominalFutureValue;
      realFutureValue;
      preTaxFutureValue;
      afterTaxFutureValue;
      principalWithoutInterest;
    };
  };

  func calcAdjustedCashflows(_cashflows : [Cashflow], rate : Float, years : Nat, freq : Nat) : Float {
    var sum : Float = 0.0;
    for (cf in _cashflows.values()) {
      let futureValue = cf.amount * (1.0 + (rate / freq.toFloat())) ** (((years - cf.year) * freq)).toFloat();
      sum += futureValue;
    };
    sum;
  };

  func calcCashflowSum(_cashflows : [Cashflow]) : Float {
    var sum : Float = 0.0;
    for (cf in _cashflows.values()) {
      sum += cf.amount;
    };
    sum;
  };

  public query func getValidTextEntries(entries : [Text], _ : Text, pattern : Text) : async [Text] {
    entries.filter(
      func(entry) {
        entry.contains(#text pattern);
      }
    );
  };

  public func isTextValid(input : Text) : async Bool {
    func isAllowedChar(c : Char) : Bool {
      let intVal = c.toNat32();
      (intVal >= 'A'.toNat32() and intVal <= 'Z'.toNat32()) or
      (intVal >= 'a'.toNat32() and intVal <= 'z'.toNat32()) or
      (intVal >= '0'.toNat32() and intVal <= '9'.toNat32()) or
      (c == ' ');
    };
    input.toArray().all(isAllowedChar);
  };

  public func isPositiveNumber(number : Int) : async Bool {
    number > 0;
  };

  public func isValidEmail(email : Text) : async Bool {
    let chars = email.toArray();
    let hasAt = chars.any(func(c) { c == '@' });
    let hasDot = chars.any(func(c) { c == '.' });
    hasAt and hasDot;
  };
};
