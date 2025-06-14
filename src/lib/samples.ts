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

export const sampleJQueryCode = `$(document).ready(function() {
  function fetchPosts() {
    $('#loading').show();
    $('#error').hide();
    $.get('https://jsonplaceholder.typicode.com/posts?userId=1')
      .done(function(data) {
        var ul = $('#posts-list').empty();
        data.forEach(function(post) {
          ul.append('<li><strong>' + post.title + '</strong><p>' + post.body + '</p></li>');
        });
      })
      .fail(function(err) {
        $('#error').text('Failed to load posts.').show();
      })
      .always(function() {
        $('#loading').hide();
      });
  }

  $('#refreshBtn').on('click', fetchPosts);

  $('#addBtn').on('click', function() {
    $('#loading').show();
    $('#error').hide();
    $.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'New Post',
      body: 'This is a new post.'
    })
    .done(function(data) {
      $('#posts-list').append('<li><strong>' + data.title + '</strong><p>' + data.body + '</p></li>');
    })
    .fail(function(err) {
      $('#error').text('Failed to add post.').show();
    })
    .always(function() {
      $('#loading').hide();
    });
  });

  fetchPosts();
});
/* 
HTML:
<div class="user-posts">
  <button id="refreshBtn">Refresh</button>
  <button id="addBtn">Add Post</button>
  <div id="loading" style="display:none;">Loading...</div>
  <div id="error" class="error" style="display:none;"></div>
  <ul id="posts-list"></ul>
</div>
*/
`;

export const sampleVanillaJSCode = `document.addEventListener('DOMContentLoaded', function() {
  const postsList = document.getElementById('posts-list');
  const refreshBtn = document.getElementById('refreshBtn');
  const addBtn = document.getElementById('addBtn');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');

  function setLoading(visible) {
    loading.style.display = visible ? '' : 'none';
  }

  function setError(msg) {
    error.textContent = msg;
    error.style.display = msg ? '' : 'none';
  }

  function fetchPosts() {
    setLoading(true);
    setError('');
    fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
      .then(res => res.json())
      .then(data => {
        postsList.innerHTML = '';
        data.forEach(post => {
          const li = document.createElement('li');
          li.innerHTML = '<strong>' + post.title + '</strong><p>' + post.body + '</p>';
          postsList.appendChild(li);
        });
      })
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false));
  }

  refreshBtn.addEventListener('click', fetchPosts);

  addBtn.addEventListener('click', function() {
    setLoading(true);
    setError('');
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Post', body: 'This is a new post.' })
    })
      .then(res => res.json())
      .then(post => {
        const li = document.createElement('li');
        li.innerHTML = '<strong>' + post.title + '</strong><p>' + post.body + '</p>';
        postsList.appendChild(li);
      })
      .catch(() => setError('Failed to add post.'))
      .finally(() => setLoading(false));
  });

  fetchPosts();
});
/*
HTML:
<div class="user-posts">
  <button id="refreshBtn">Refresh</button>
  <button id="addBtn">Add Post</button>
  <div id="loading" style="display:none;">Loading...</div>
  <div id="error" class="error" style="display:none;"></div>
  <ul id="posts-list"></ul>
</div>
*/
`;

export const sampleAngularJSCode = `angular.module('app', [])
  .controller('UserPostsCtrl', function($scope, $http) {
    $scope.posts = [];
    $scope.loading = false;
    $scope.error = '';
    
    $scope.fetchPosts = function() {
      $scope.loading = true;
      $scope.error = '';
      $http.get('https://jsonplaceholder.typicode.com/posts?userId=1')
        .then(function(res) {
          $scope.posts = res.data;
        }, function() {
          $scope.error = 'Failed to load posts.';
        })
        .finally(function() {
          $scope.loading = false;
        });
    };

    $scope.refreshPosts = $scope.fetchPosts;

    $scope.addPost = function() {
      $scope.loading = true;
      $scope.error = '';
      $http.post('https://jsonplaceholder.typicode.com/posts', {
        title: 'New Post', body: 'This is a new post.'
      }).then(function(res) {
        $scope.posts.push(res.data);
      }, function() {
        $scope.error = 'Failed to add post.';
      }).finally(function() {
        $scope.loading = false;
      });
    };

    $scope.fetchPosts();
  });

/*
HTML:
<div ng-app="app">
  <div ng-controller="UserPostsCtrl" class="user-posts">
    <button ng-click="refreshPosts()">Refresh</button>
    <button ng-click="addPost()">Add Post</button>
    <div ng-if="loading">Loading...</div>
    <div ng-if="error" class="error">Error: {{error}}</div>
    <ul>
      <li ng-repeat="post in posts">
        <strong>{{post.title}}</strong>
        <p>{{post.body}}</p>
      </li>
    </ul>
  </div>
</div>
*/
`;

export const sampleBackboneCode = `var Post = Backbone.Model.extend({});
var Posts = Backbone.Collection.extend({
  model: Post,
  url: 'https://jsonplaceholder.typicode.com/posts?userId=1'
});

var PostListView = Backbone.View.extend({
  el: '.user-posts',
  initialize: function() {
    this.collection = new Posts();
    this.listenTo(this.collection, 'reset add', this.render);
    this.fetchPosts();
    this.$el.find('#refreshBtn').on('click', this.fetchPosts.bind(this));
    this.$el.find('#addBtn').on('click', this.addPost.bind(this));
    this.loading = this.$el.find('#loading');
    this.error = this.$el.find('#error');
  },
  fetchPosts: function() {
    var self = this;
    self.loading.show();
    self.error.hide();
    self.collection.fetch({
      reset: true,
      success: function() {
        self.loading.hide();
      },
      error: function() {
        self.loading.hide();
        self.error.text('Failed to load posts.').show();
      }
    });
  },
  addPost: function() {
    var self = this;
    self.loading.show();
    self.error.hide();
    Backbone.ajax({
      type: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      data: JSON.stringify({ title: 'New Post', body: 'This is a new post.' }),
      contentType: 'application/json',
      success: function(data) {
        self.collection.add(data);
        self.loading.hide();
      },
      error: function() {
        self.loading.hide();
        self.error.text('Failed to add post.').show();
      }
    });
  },
  render: function() {
    var $ul = this.$el.find('#posts-list').empty();
    this.collection.each(function(post) {
      $ul.append('<li><strong>' + post.get('title') + '</strong><p>' + post.get('body') + '</p></li>');
    });
  }
});

new PostListView();

/*
HTML:
<div class="user-posts">
  <button id="refreshBtn">Refresh</button>
  <button id="addBtn">Add Post</button>
  <div id="loading" style="display:none;">Loading...</div>
  <div id="error" class="error" style="display:none;"></div>
  <ul id="posts-list"></ul>
</div>
*/
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

export const getSampleCode = (language: string) => {
  switch (language.toLowerCase()) {
    case "ember":
      return sampleEmberCode;
    case "jquery":
      return sampleJQueryCode;
    case "vanilla js":
      return sampleVanillaJSCode;
    case "angularjs":
      return sampleAngularJSCode;
    case "backbone.js":
      return sampleBackboneCode;
    case "react":
      return sampleReactCodeFromLegacy;
    default:
      return "";
  }
};
