import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";
import { AuthService } from '../auth/auth.service';


@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router,private authService: AuthService) {}

  getPosts() {
    const email=this.authService.getEmail();
    this.http
      .get<{ message: string; posts: any }>("https://aqueous-plains-00254.herokuapp.com/api/posts/all/" + email)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "https://aqueous-plains-00254.herokuapp.com/api/posts/" + id
    );
  }

  addPost(title: string, content: string,email: string) {

    const post: Post = { id: null, title: title, content: content , email: email };
    this.http
      .post<{ message: string; postId: string }>(
        "https://aqueous-plains-00254.herokuapp.com/api/posts",
        post
      )
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, email:string) {
    const post = { id: id, title: title, content: content, email:email };
    this.http
      .put("https://aqueous-plains-00254.herokuapp.com/api/posts/" + id, post)
      .subscribe(response => {
        
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("https://aqueous-plains-00254.herokuapp.com/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
