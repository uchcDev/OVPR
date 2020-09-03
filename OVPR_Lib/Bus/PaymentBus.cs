using OVPR_Lib.Dat;
using System;
using System.Collections.Generic;
using System.Text;
using static OVPR_Lib.Dat.PaymentDat;

namespace OVPR_Lib.Bus
{
    public class PaymentBus
    {
        public static List<PaymentEnt> GetPayments(int CommitPK, string PayStatus, char? CurrentOnly)
        {          
            return PaymentDat.usp_14_Payment_GetPaymentsByCommitPkAndStatus(CommitPK, PayStatus, CurrentOnly);
        }

        public static string GetCurrentFiscalYear()
        {
            return PaymentDat.usp_19_GetCurrentFiscalYear();
        }
        public static int GetNextAvailablePaymentNumber(int Commitment_PK)
        {
            return PaymentDat.usp_28A_Payment_GetNextAvailablePaymentNumber(Commitment_PK);
        }


        public static void AddPayment(PaymentChangeEnt ent)
        {

            PaymentDat.usp_28_Payment_AddPayment(ent);
        }

        public static void EditPayment(PaymentChangeEnt ent)
        {
            PaymentDat.usp_30_Payment_EditPayment(ent);
        }

        public static void DeletePayment(int Commitment_PK, int Payment_PK, string PayStatus)
        {

            PaymentDat.usp_29_Payment_DeletePayment(Commitment_PK, Payment_PK, PayStatus);
        }


    }
}
