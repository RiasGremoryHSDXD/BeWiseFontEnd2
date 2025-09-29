import { v } from "convex/values";
import { query } from "../../_generated/server";


export const incomeInfo = query({
    args: {
        incomeID: v.id("income")
    },
    handler: async (ctx, args) => {

        const incomeInfoData = ctx.db.get(args.incomeID)

        if(!incomeInfoData) throw new Error("Income not found [incomeInfo.ts] -> [Dota 2]")

        return incomeInfoData
    }
})