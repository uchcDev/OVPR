using OVPR_Lib.Dat;
using System;
using System.Collections.Generic;
using System.Text;

using System.Linq;

using static OVPR_Lib.Dat.OVPRDat;
using System.IO;

using OVPR_Lib.Utils;

namespace OVPR_Lib.Bus
{
    public class OVPRBus
    {
        public static usp_16a_GetProposalDetailByPropNo_Ent GetProposalDetailByPropNo(string proposalNum)
        {
            return OVPRDat.usp_16a_GetProposalDetailByPropNo(proposalNum);
        }
    



        public static int CreateCommitment(string LoginEmail, CommitmentChangeEnt commitment, List<FileToUpload> files, out string sql)
        {
           // var uploadArgs = new UploadArgs();
            var Commit_PK =  OVPRDat.usp_25_Commitment_CreateCommitmentRequest(LoginEmail, commitment, out sql);
            //uploadArgs.Files = files;
            //Upload(uploadArgs, LoginEmail);

            SyncFiles(Commit_PK, files, LoginEmail);

            return Commit_PK;
        }

        public static void UpdateCommitment(string LoginEmail, CommitmentChangeEnt commitment, List<FileToUpload> files, out string sql)
        {
            SyncFiles(commitment.CommitmentPK.Value, files, LoginEmail);
            OVPRDat.usp_26_Commitment_UpdateBaseCommitmentRequest(LoginEmail, commitment, out sql);
        }
        public static CommitmentEnt GetCommitment(int Commitment_PK)
        {
            return OVPRDat.usp_27_GetCommitmentDetailByCommitPK(Commitment_PK)[0];
        }

        public static string GetCommitmentStatusByCommitPK(int Commitment_PK)
        {
            return OVPRDat.usp_27b_GetCommitmentStatusByCommitPK(Commitment_PK);
        }



        public class CommitmentsSearchReturnEnt
        {
            public int totalRows;
            public int totalPages;
            public List<CommitmentsSearchResultEnt> result;

        }

        public static CommitmentsSearchReturnEnt Search(CommitmentsSearchArg arg)
        {            

            var toReturn = new CommitmentsSearchReturnEnt();

            var allData = OVPRDat.usp_13_Commitment_GetCommitmentData(arg);

            allData = allData.AsQueryable().OrderByFieldName(arg.sortBy_Property, arg.sortBy_IsAsc).ToList();

            var startIndex = arg.pageIndex * arg.pageSize;
            var length = arg.pageSize;

            if ((startIndex + arg.pageSize) > allData.Count)
            {
                length = allData.Count - startIndex;
            }

            toReturn.totalRows = allData.Count;
            toReturn.totalPages = (int)Math.Ceiling((double)toReturn.totalRows / arg.pageSize);
            toReturn.result = allData.GetRange(startIndex, length);
            

            return toReturn;
        }


        public static List<DocumentEnt> GetDocuments(int Commitment_PK)
        {
            return OVPRDat.usp_21_Document_GetDocFileNamesByCommitment_PK(Commitment_PK);
        }



        public static List<demo_GetAllCommitmentsEnt> _demo_GetAllCommitments()
        {
            return OVPRDat._demo_GetAllCommitments();
        }

 
        public class FileToUpload
        {
            public int? DocumentPK { get; set; }
            public string FileName { get; set; }
            public int FileSize { get; set; }
            public string FileType { get; set; }
          
            public string FileAsBase64 { get; set; }
           
        }
        

        public static byte[] GetFile(int DOC_PK_ID)
        {
            return OVPRDat.usp_22a_Document_GetDocFileByDocPK(DOC_PK_ID);
          
        }




        private static void SyncFiles(int commit_PK, List<FileToUpload>files, string upLoadedBy)
        {
            var oldDDocs = GetDocuments(commit_PK);

            var toDelete = oldDDocs.Where(oldElem => files.Where(newElem => newElem.DocumentPK == oldElem.Document_PK).Count() == 0);
            var toAdd = files.Where(p => p.DocumentPK == null);

            foreach (var file in toDelete)
            {
                OVPRDat.usp_24a_Document_DelSpecificDocument(file.Document_PK);
            }

            foreach (var file in toAdd)
            {
/*                In the Angular code you’re going to write, you’re going to be reading the file from the file system usingthe FileReader class. 
 *                This class is only available on newer browsers.The FileReader class reads the file from disk as a Base64-encoded string. 
 *                At the beginning of this Base64-encoded string is the type of file read from the disk followed by a comma.
 *                The rest of the file contents are after the comma.Next is a sample of what the contents of the file uploaded look like.
                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAg..."

    */
                if(file.FileAsBase64.Contains(","))
                {
                    file.FileAsBase64 = file.FileAsBase64.Substring(file.FileAsBase64.IndexOf(",") + 1);
                }

                OVPRDat.usp_23_Document_InsertDocFile(commit_PK, file.FileName, file.FileSize, file.FileType, Convert.FromBase64String(file.FileAsBase64), upLoadedBy);
            }
        }
    }
}
