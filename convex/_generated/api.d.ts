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
import type * as functions_balance_currentBalance from "../functions/balance/currentBalance.js";
import type * as functions_balance_initializedBalance from "../functions/balance/initializedBalance.js";
import type * as functions_credentials_insertNewUser from "../functions/credentials/insertNewUser.js";
import type * as functions_credentials_logInUser from "../functions/credentials/logInUser.js";
import type * as functions_credentials_updateUserName from "../functions/credentials/updateUserName.js";
import type * as functions_credentials_validateUserEmail from "../functions/credentials/validateUserEmail.js";
import type * as functions_expenses_deleteExpenses from "../functions/expenses/deleteExpenses.js";
import type * as functions_expenses_expensesInfo from "../functions/expenses/expensesInfo.js";
import type * as functions_expenses_expensesList from "../functions/expenses/expensesList.js";
import type * as functions_expenses_insertNewExpenses from "../functions/expenses/insertNewExpenses.js";
import type * as functions_expenses_totalEachCategoryExpenses from "../functions/expenses/totalEachCategoryExpenses.js";
import type * as functions_expenses_totalExpenses from "../functions/expenses/totalExpenses.js";
import type * as functions_expenses_updateExpensesInfo from "../functions/expenses/updateExpensesInfo.js";
import type * as functions_income_deleteIncome from "../functions/income/deleteIncome.js";
import type * as functions_income_incomeInfo from "../functions/income/incomeInfo.js";
import type * as functions_income_incomeList from "../functions/income/incomeList.js";
import type * as functions_income_insertNewIncome from "../functions/income/insertNewIncome.js";
import type * as functions_income_totalEachCategoryIncome from "../functions/income/totalEachCategoryIncome.js";
import type * as functions_income_totalIncome from "../functions/income/totalIncome.js";
import type * as functions_income_updateIncomeInfo from "../functions/income/updateIncomeInfo.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/balance/currentBalance": typeof functions_balance_currentBalance;
  "functions/balance/initializedBalance": typeof functions_balance_initializedBalance;
  "functions/credentials/insertNewUser": typeof functions_credentials_insertNewUser;
  "functions/credentials/logInUser": typeof functions_credentials_logInUser;
  "functions/credentials/updateUserName": typeof functions_credentials_updateUserName;
  "functions/credentials/validateUserEmail": typeof functions_credentials_validateUserEmail;
  "functions/expenses/deleteExpenses": typeof functions_expenses_deleteExpenses;
  "functions/expenses/expensesInfo": typeof functions_expenses_expensesInfo;
  "functions/expenses/expensesList": typeof functions_expenses_expensesList;
  "functions/expenses/insertNewExpenses": typeof functions_expenses_insertNewExpenses;
  "functions/expenses/totalEachCategoryExpenses": typeof functions_expenses_totalEachCategoryExpenses;
  "functions/expenses/totalExpenses": typeof functions_expenses_totalExpenses;
  "functions/expenses/updateExpensesInfo": typeof functions_expenses_updateExpensesInfo;
  "functions/income/deleteIncome": typeof functions_income_deleteIncome;
  "functions/income/incomeInfo": typeof functions_income_incomeInfo;
  "functions/income/incomeList": typeof functions_income_incomeList;
  "functions/income/insertNewIncome": typeof functions_income_insertNewIncome;
  "functions/income/totalEachCategoryIncome": typeof functions_income_totalEachCategoryIncome;
  "functions/income/totalIncome": typeof functions_income_totalIncome;
  "functions/income/updateIncomeInfo": typeof functions_income_updateIncomeInfo;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
