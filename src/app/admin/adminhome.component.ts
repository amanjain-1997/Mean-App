import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";



@Component({
  templateUrl: 'adminhome.component.html',
  styleUrls: ['adminhome.component.css']
})
export class AdminHomeComponent {
  constructor(private http: HttpClient) {}
  myControl: FormControl = new FormControl();
  title = 'Chart Generation from String';
  options= [];
  id = [];
  content =[];
  titleSingle;
  contentSingle;
  displayedColumns: string[] = ['position', 'name', 'weight'];
  tableneeded = false;
  graphneeded = false;


  ELEMENT_DATA;
  dataSource;
  chartOptions = {
    responsive: true    
  }

    piechartOptions = {
    responsive: true   
  }

  chartData;
  piechartData;
  labels =  ['A', 'E', 'I', 'O', 'U'];
  pielabels = ['UpperCaseLetters','LowerCaseLetters','SpecialCharacters']

  colors = [
    { 
      backgroundColor: 'rgba(30, 169, 224, 0.8)'
    },

  ]

  piecolors = [
    { 
      backgroundColor: 'rgba(30, 169, 224, 0.8)'
    },
    { 
      backgroundColor: 'rgba(0, 0, 224, 0.8)'
    },
    { 
      backgroundColor: 'rgba(100, 169, 224, 0.8)'
    },

  ]
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    
    this.http
    .get<{ message: string; posts: any }>("https://aqueous-plains-00254.herokuapp.com/api/posts/")
    .subscribe(transformedPosts => {

      this.options=transformedPosts.posts.map(x => x.title);
      this.id=transformedPosts.posts.map(x => x._id);
      this.content=transformedPosts.posts.map(x => x.content);
      console.log(this.options);

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  });

  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  onSubmit(){
    console.log(this.myControl.value);
    var val = this.content[this.options.indexOf(this.myControl.value)];
    this.contentSingle=val;
    this.titleSingle = this.myControl.value;
    console.log(this.options);
    var uppercount=0;
    var lowerCount=0;
    var vowela=0;
    var vowele=0;
    var voweli=0;
    var vowelo=0;
    var vowelu=0;
    var ch="";

    var rx = /[a-z]/gi;
    var letters = val.match(rx);  
    var specialc = (val.split(" ").join("").length) - letters.length ;
    console.log(specialc);
    var words = val.split(" ");
    var sentences = val.split(".");
    var sentencescount = sentences.length-1;
    if (sentencescount == 0) sentencescount=1; 
    for(var i = 0; i < val.length ; i++)
    {
	      ch = val.charAt(i);
        if(ch >= 'A' && ch <= 'Z') ++uppercount;
        if(ch >= 'a' && ch <= 'z') ++lowerCount;
        if(ch == 'A' || ch =='a')  ++vowela;
        if(ch == 'E' || ch =='e')  ++vowele;
        if(ch == 'I' || ch =='i')  ++voweli;
        if(ch == 'O' || ch =='o')  ++vowelo;
        if(ch == 'U' || ch =='u')  ++vowelu;

      
    }
    
  this.ELEMENT_DATA  = [
      {position: 1, name: 'Number of Sentences', weight: sentencescount  },
      {position: 2, name: 'Number of Words', weight: words.length  },
      {position: 3, name: 'Number of Letters', weight: letters.length},
      {position: 4, name: 'Number of Capital Letters', weight: uppercount},
      {position: 5, name: 'Number of LowerCase Lettters', weight: lowerCount}, 
    ];
  
    console.log(vowela);
    console.log(vowele);
   this.dataSource = this.ELEMENT_DATA;
    this.tableneeded = true;

    this.chartData = [
      {
        label: 'Frequency',
        data: [vowela, vowele, voweli, vowelo, vowelu] 
      }
    ];

    this.piechartData = [
      {
        data: [uppercount, lowerCount, specialc]
      }
    ];

    this.graphneeded=true;

  }
  onChartClick(event) {
    console.log(event);
  }

}
