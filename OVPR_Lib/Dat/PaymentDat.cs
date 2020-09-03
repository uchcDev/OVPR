using OVPR_Lib.Utils;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OVPR_Lib.Dat
{
    public class PaymentDat
    {
        public class PaymentEnt
        {
            public string CommitmentNumber;
            public string FY;
            public int PaymentPK;
            public int PaymentNo;
            public string PaymentComment;
            public string Comment;
            public DateTime? DueDate;
            public string AmountDue;
            public DateTime? DatePaid;
            public string TransactionNumber;
            public string FromAccount;
            public string ToAccount;
            public string AmountPaid;
            public string AmountNotFunded;
            public string NotFundedReason;
            public int PayStatHist_PK;
            public string PayStatusDesc;
            public string CurrentStatus;
        }
        public static List<PaymentEnt> usp_14_Payment_GetPaymentsByCommitPkAndStatus(int CommitPK, string PayStatus, char? CurrentOnly)
        {
            string procName = "OVPR.usp_14_Payment_GetPaymentsByCommitPkAndStatus";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@CommitPK", CommitPK));
            prms.Add(new SqlParameter("@PayStatus", PayStatus));
            prms.Add(new SqlParameter("@CurrentOnly", CurrentOnly));

            return DataAccessHelpers.GetEnts<PaymentEnt>(procName, prms);
        }

        /*
        public static List<PaymentEnt> usp_27_GetCommitmentDetailByCommitPK(int Commitment_PK)
        {            
        }
        */

        public static string usp_19_GetCurrentFiscalYear()
        {
            string procName = "OVPR.usp_19_GetCurrentFiscalYear";

            var prms = new List<SqlParameter>();

            return DataAccessHelpers.ExecuteGetString(procName, prms);
        }
        public static int usp_28A_Payment_GetNextAvailablePaymentNumber(int Commitment_PK)
        {
            string procName = "OVPR.usp_28A_Payment_GetNextAvailablePaymentNumber";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Commitment_PK", Commitment_PK));

            return DataAccessHelpers.ExecuteGetInt(procName, prms);
        }

        public class PaymentChangeEnt
        {
            public int? Payment_PK;
            public string Commitment_PK;
            public string FY;
            public int? PaymentNumber;
            public DateTime? DueDate;
            public string PayStatus;
            public string PayComment;
            public string Amount;
            public string TransNumber;
            public DateTime? PaymentDate;
            public string AcctFrom;
            public string AcctTo;
            public string Reason;
        }


        public static void usp_28_Payment_AddPayment(PaymentChangeEnt ent)
        {
            string procName = "OVPR.usp_28_Payment_AddPayment";

            var prms = new List<SqlParameter>();
            prms.Add(new SqlParameter("@Commitment_PK", ent.Commitment_PK));
            prms.Add(new SqlParameter("@FY", ent.FY));
            prms.Add(new SqlParameter("@PaymentNumber", ent.PaymentNumber));
            prms.Add(new SqlParameter("@DueDate", ent.DueDate));
            prms.Add(new SqlParameter("@PayStatus", ent.PayStatus));
            prms.Add(new SqlParameter("@PayComment", ent.PayComment));
            prms.Add(new SqlParameter("@Amount",  ent.Amount));
            prms.Add(new SqlParameter("@TransNumber", ent.TransNumber));
            prms.Add(new SqlParameter("@PaymentDate", ent.PaymentDate));
            prms.Add(new SqlParameter("@AcctFrom", ent.AcctFrom));
            prms.Add(new SqlParameter("@AcctTo", ent.AcctTo));
            prms.Add(new SqlParameter("@Reason", ent.Reason));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }


        public static void usp_30_Payment_EditPayment(PaymentChangeEnt ent)
        {
            string procName = "OVPR.usp_30_Payment_EditPayment";

            var prms = new List<SqlParameter>();

            prms.Add(new SqlParameter("@Commitment_PK", ent.Commitment_PK));
            prms.Add(new SqlParameter("@Payment_PK", ent.Payment_PK));
            prms.Add(new SqlParameter("@FiscalYear", ent.FY));
            prms.Add(new SqlParameter("@DueDate", ent.DueDate));
            prms.Add(new SqlParameter("@PayStatus", ent.PayStatus));
            prms.Add(new SqlParameter("@Comment", ent.PayComment));
            prms.Add(new SqlParameter("@Amount", ent.Amount));
            prms.Add(new SqlParameter("@TransactionNumber", ent.TransNumber));
            prms.Add(new SqlParameter("@PaymentDate", ent.PaymentDate));
            prms.Add(new SqlParameter("@AcctFrom", ent.AcctFrom));
            prms.Add(new SqlParameter("@AcctTo", ent.AcctTo));
            prms.Add(new SqlParameter("@Reason", ent.Reason));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }


        public static void usp_29_Payment_DeletePayment(int Commitment_PK, int Payment_PK, string PayStatus)
        {

            string procName = "OVPR.usp_29_Payment_DeletePayment";

            var prms = new List<SqlParameter>();

            prms.Add(new SqlParameter("@Commitment_PK", Commitment_PK));
            prms.Add(new SqlParameter("@Payment_PK", Payment_PK));
            prms.Add(new SqlParameter("@PayStatus", PayStatus));
            //prms.Add(new SqlParameter("@DeleteAll", DeleteAll));

            DataAccessHelpers.ExecuteGetDataTableStoredProc(procName, prms);
        }

    }

}
