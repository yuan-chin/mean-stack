import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'booksapp';
  readonly APIUrl="http://localhost:5038/api/books/";

  books:any=[];
  editingId: any = null;

  constructor(private http:HttpClient){}

  ngOnInit(){
    this.refreshBooks();
  }

  refreshBooks(){
    this.http.get(this.APIUrl+'GetBooks').subscribe(data=>{
      this.books=data;
    })
  }

  addBook(){
    var newBook=(<HTMLInputElement>document.getElementById("newBook")).value;
    var newDesc=(<HTMLInputElement>document.getElementById("newDesc")).value;
    var newPrice=(<HTMLInputElement>document.getElementById("newPrice")).value;
    var newAuthor=(<HTMLInputElement>document.getElementById("newAuthor")).value;
    var newGenre=(<HTMLInputElement>document.getElementById("newGenre")).value;

    var formData=new FormData();
    formData.append("title", newBook);
    formData.append("description", newDesc);
    formData.append("price", newPrice.toString());
    formData.append("author", newAuthor);
    formData.append("genre", newGenre);

    if(this.editingId == null){
      // ADD BOOK
      this.http.post(this.APIUrl+'AddBook', formData).subscribe(data=>{
        alert(data);
        this.refreshBooks();
        this.clearForm();
      })
    }
    else{
      // UPDATE BOOK
      formData.append("id", this.editingId);

      this.http.put(this.APIUrl+'UpdateBook', formData).subscribe(data=>{
        alert(data);
        this.editingId = null;
        this.refreshBooks();
        this.clearForm();
      })
    }
  }

  editBook(book:any){
    this.editingId = book.id;

    (<HTMLInputElement>document.getElementById("newBook")).value = book.title;
    (<HTMLInputElement>document.getElementById("newDesc")).value = book.desc;
    (<HTMLInputElement>document.getElementById("newPrice")).value = book.price;
    (<HTMLInputElement>document.getElementById("newAuthor")).value = book.author;
    (<HTMLInputElement>document.getElementById("newGenre")).value = book.genre;
  }

  deleteBook(id:any){
    this.http.delete(this.APIUrl+'DeleteBook?id='+id).subscribe(data=>{
      alert(data);
      this.refreshBooks()
    })
  }

  clearForm(){
    (<HTMLInputElement>document.getElementById("newBook")).value = "";
    (<HTMLInputElement>document.getElementById("newDesc")).value = "";
    (<HTMLInputElement>document.getElementById("newPrice")).value = "";
    (<HTMLInputElement>document.getElementById("newAuthor")).value = "";
    (<HTMLInputElement>document.getElementById("newGenre")).value = "";
  }

}
