import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Investment {
    inflationRate?: number;
    compoundingFrequency?: bigint;
    cashflows: Array<Cashflow>;
    interestRate: number;
    initialInvestment: number;
    years: bigint;
    taxRate?: number;
}
export interface FutureValueResult {
    afterTaxFutureValue: number;
    principalWithoutInterest: number;
    preTaxFutureValue: number;
    realFutureValue: number;
    nominalFutureValue: number;
}
export interface Cashflow {
    year: bigint;
    amount: number;
}
export interface backendInterface {
    futureValue(investment: Investment): Promise<FutureValueResult>;
    getValidTextEntries(entries: Array<string>, arg1: string, pattern: string): Promise<Array<string>>;
    isPositiveNumber(number: bigint): Promise<boolean>;
    isTextValid(input: string): Promise<boolean>;
    isValidEmail(email: string): Promise<boolean>;
}
