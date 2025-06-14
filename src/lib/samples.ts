
export const techStacks = ["React", "Vue", "Svelte", "Angular", "English"];
export const fromLanguages = ["Ember", "Backbone.js", "jQuery", "AngularJS", "Vanilla JS"];
export const apiProviders = ["Demo", "Perplexity", "OpenAI", "Claude"];

export const sampleEmberCode = `import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import fetch from 'fetch';

export default class UserPostsComponent extends Component {
  @tracked posts = [];
  @tracked currentPage = 1;
  @tracked isLoading = false;
  @tracked error = null;
  @tracked isAuthenticated = false;

  constructor() {
    super(...arguments);
    this.fetchPosts();
  }

  async fetchPosts() {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1');
      let data = await response.json();
      this.posts = data;
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  refreshPosts() {
    this.fetchPosts();
  }

  @action
  async addPost(title, body) {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      let data = await response.json();
      this.posts.push(data);
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async deletePost(id) {
    this.isLoading = true;
    this.error = null;
    try {
      let response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
        method: 'DELETE',
      });
      if (response.ok) {
        this.posts = this.posts.filter(post => post.id !== id);
      }
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }
}

// template.hbs
<div class="user-posts">
  <button {{on "click" this.refreshPosts}}>Refresh</button>
  <button {{on "click" this.addPost "New Post" "This is a new post."}}>Add Post</button>
  {{#if this.isLoading}}
    <p>Loading...</p>
  {{else if this.error}}
    <p class="error">Error: {{this.error}}</p>
  {{else}}
    <ul>
      {{#each this.posts as |post|}}
        <li>
          <strong>{{post.title}}</strong>
          <p>{{post.body}}</p>
        </li>
      {{/each}}
    </ul>
  {{/if}}
</div>
`;

export const sampleReactCodeFromLegacy = `import React, { useState, useEffect } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts?userId=1";
const CREATE_URL = "https://jsonplaceholder.typicode.com/posts";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage] = useState(1); // Pagination feature stub (can be expanded)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated] = useState(true); // Auth feature stub (can be toggled)
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refreshPosts = () => {
    fetchPosts();
  };

  const addPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(CREATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost.title ? newPost : { title: "New Post", body: "This is a new post." }),
      });
      const data = await response.json();
      setPosts(prev => [...prev, data]);
      setNewPost({ title: "", body: "" });
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPosts(prev => prev.filter(post => post.id !== id));
      } else {
        setError("Failed to delete post");
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-posts p-4 border rounded-lg max-w-xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          onClick={refreshPosts}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
        <button
          onClick={addPost}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Post
        </button>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Body"
          value={newPost.body}
          onChange={e => setNewPost(prev => ({ ...prev, body: e.target.value }))}
        />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 font-semibold">Error: {error}</p>
      ) : (
        <ul className="space-y-2">
          {posts.map(post=>(
            <li key={post.id} className="p-3 border rounded flex flex-col gap-1 bg-gray-50">
              <div className="flex justify-between items-center">
                <strong>{post.title}</strong>
                <button
                  className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
              </div>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;`;
