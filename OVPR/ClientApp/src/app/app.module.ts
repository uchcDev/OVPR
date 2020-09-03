import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';




import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

//------------------------------------
/*
import { MatSelectModule, MatOption, MatTooltipModule, MatButtonModule,  MatRadioModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
*/
//import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
//import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';








//------------------------------------

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommitmentComponent } from './OVPR/Components/commitment/commitment.component';


import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './OVPR/Components/main/main.component';
import { SplashScreenComponent } from './OVPR/Screens/splash-screen/splash-screen.component';

import { CommitmentSummaryComponent } from './OVPR/Components/commitment-summary/commitment-summary.component';
import { PaymentsComponent } from './OVPR/Components/payments/payments.component';
import { SearchComponent } from './OVPR/Components/search/search.component';
import { FileUploadComponent } from './OVPR/Components/file-upload/file-upload.component';
import { UserComponent } from './OVPR/Components/user/user.component';
import { TypeComponent } from './OVPR/Components/type/type.component';
import { TestComponent } from './OVPR/Components/test/test.component';
import { WinComponent,mainDIVWrapper } from './OVPR/Components/Utils/win/win/win.component';
import { TreeNodeWrapperComponent } from './OVPR/Components/Utils/win/tree-node-wrapper/tree-node-wrapper.component';

 
 
@NgModule({
  declarations: [
    AppComponent,
    CommitmentComponent,
    MainComponent,
    SplashScreenComponent,
    
    CommitmentSummaryComponent,
    PaymentsComponent,
    SearchComponent,
    FileUploadComponent,
    UserComponent,
    TypeComponent,
    TestComponent,
    WinComponent,
    mainDIVWrapper,
    TreeNodeWrapperComponent
   
    
    
  ],
  entryComponents: [ CommitmentComponent, CommitmentSummaryComponent, PaymentsComponent, SearchComponent, UserComponent, TypeComponent, TestComponent],



  imports: [
    BrowserModule,    
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    //
    /*
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRadioModule,
    MatSelectModule,
    */

   A11yModule,
   CdkStepperModule,
   CdkTableModule,
   CdkTreeModule,
   DragDropModule,
   MatAutocompleteModule,
   MatBadgeModule,
   MatBottomSheetModule,
   MatButtonModule,
   MatButtonToggleModule,
   MatCardModule,
   MatCheckboxModule,
   MatChipsModule,
   MatStepperModule,
   MatDatepickerModule,
   MatDialogModule,
   MatDividerModule,
   MatExpansionModule,
   MatGridListModule,
   MatIconModule,
   MatInputModule,
   MatListModule,
   MatMenuModule,
   MatNativeDateModule,
   MatPaginatorModule,
   MatProgressBarModule,
   MatProgressSpinnerModule,
   MatRadioModule,
   MatRippleModule,
   MatSelectModule,
   MatSidenavModule,
   MatSliderModule,
   MatSlideToggleModule,
   MatSnackBarModule,
   MatSortModule,
   MatTableModule,
   MatTabsModule,
   MatToolbarModule,
   MatTooltipModule,
   MatTreeModule,
   PortalModule,
   ScrollingModule,

    //

    DragDropModule,

    FormsModule,
    ReactiveFormsModule,

   


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
