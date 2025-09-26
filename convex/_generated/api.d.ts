/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_credentials_insertNewUser from "../functions/credentials/insertNewUser.js";
import type * as functions_credentials_logInUser from "../functions/credentials/logInUser.js";
import type * as functions_credentials_updateUserName from "../functions/credentials/updateUserName.js";
import type * as functions_credentials_validateUserEmail from "../functions/credentials/validateUserEmail.js";
import type * as functions_expenses_insertNewExpenses from "../functions/expenses/insertNewExpenses.js";
import type * as functions_income_insertNewIncome from "../functions/income/insertNewIncome.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/credentials/insertNewUser": typeof functions_credentials_insertNewUser;
  "functions/credentials/logInUser": typeof functions_credentials_logInUser;
  "functions/credentials/updateUserName": typeof functions_credentials_updateUserName;
  "functions/credentials/validateUserEmail": typeof functions_credentials_validateUserEmail;
  "functions/expenses/insertNewExpenses": typeof functions_expenses_insertNewExpenses;
  "functions/income/insertNewIncome": typeof functions_income_insertNewIncome;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
