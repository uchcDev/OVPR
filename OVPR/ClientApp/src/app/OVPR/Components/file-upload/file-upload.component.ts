import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { OVPRService } from '../../DropDown/ovpr.service';

import { FileToUpload, DocumentEnt } from '../../DropDown/DataDeclares';


export class CommitFile {
  public DocumentPK: number;
  public FileName: string;
  public File: File;

  private constructor() {

  }

  public static InitByFile(File: File): CommitFile {
    let ent = new CommitFile();
    ent.File = File;
    ent.FileName = ent.File.name;

    return ent;
  }
  public static InitByName(DocumentPK: number, FileName: string): CommitFile {
    let ent = new CommitFile();
    ent.DocumentPK = DocumentPK;
    ent.FileName = FileName;

    return ent;
  }


}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {


  files: CommitFile[] = [];


  constructor(private service: OVPRService) {

  }

  ngOnInit() {

  }

  InitControl(Commitment_PK: number) {
    if (Commitment_PK != null) {
      let me = this;
      this.service.GetDocuments(Commitment_PK).subscribe(p => me.onDocumentsLoad(p.ReturnData));
    }
  }

  onDocumentsLoad(docs: DocumentEnt[]) {
    for (let doc of docs) {
      this.files.push(CommitFile.InitByName(doc.Document_PK, doc.DocumentFileName))

    }
  }

  onFileChange(event) {
    for (let file of event.target.files) {
      this.files.push(CommitFile.InitByFile(file));
    }
  }
  delete(file: CommitFile) {
    this.files = this.files.filter(p => p != file);
  }

  serveFile(file: CommitFile) {
    this.service.GetFile(file.DocumentPK).subscribe(p => this.serveFile_loaded(p, file));

  }

  serveFile_loaded(blob: Blob, file: CommitFile) {

    //if ie or edge
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, file.FileName);
    }
    else {

      var blobURL = window.URL.createObjectURL(blob);

      var anchor = document.createElement("a");
      anchor.download = file.FileName;
      anchor.href = blobURL;

      // this is necessary as link.click() does not work on the latest firefox
      anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(blobURL);
        anchor.remove();
      }, 100);
    }

  }

  public GetFiles(): Observable<FileToUpload[]> {

    let toUpload: FileToUpload[] = []

    let uploadPromises: Promise<{}>[] = [];

    //console.log(this.files);
    for (let commitFile of this.files) {

      if (commitFile.DocumentPK != null) {
        let f: FileToUpload = new FileToUpload(commitFile.DocumentPK, null, null);
        toUpload.push(f);
      }
      else {
        let promise =
          new Promise(
            function (resolve, reject) {
              let reader = new FileReader();

              reader.onload = () => {

                let f: FileToUpload = new FileToUpload(commitFile.DocumentPK, commitFile.File, reader.result.toString());
                toUpload.push(f);
              };
              reader.onloadend = () => {
                resolve();
              }

              reader.readAsDataURL(commitFile.File);
            }
          );

        uploadPromises.push(promise);
      }
    }

    return new Observable<FileToUpload[]>(subscriber => {
      Promise.all(uploadPromises).then(value => subscriber.next(toUpload));
    });
  }
}
