import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Pagination from "./components/Pagination.jsx";
import Search from "./components/Search.jsx";
import UserList from "./components/UserList.jsx";
import CreateUserModal from "./components/CreateUserModal.jsx";
import { useEffect } from "react";


function App() {

  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3030/jsonstore/users')
      .then(response => response.json())
      .then(result => {
        setUsers(Object.values(result));
      })
      .catch((err) => alert(err.message));
  }, [refresh]);

  const forceRefresh = () => {
    setRefresh(state => !state);
  };

  const [showCreateUser, setShowCreateUser] = useState(false);

  const addUserClickHandler = () => {
    setShowCreateUser(true);
  };

  const closeUserModalHandler = () => {
    setShowCreateUser(false);
  };

  // const sortUsersHandler = () => {
  //   setUsers(state => [...state].sort((userA, userB) => new Date(userB.createdAt) - new Date(userA.createdAt)));
  // };

  const [sortAsc, setSortAsc] = useState(true);

const sortUsersHandler = () => {
  setUsers(state =>
    [...state].sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt) - new Date(b.createdAt) // ascending (oldest → newest)
        : new Date(b.createdAt) - new Date(a.createdAt) // descending (newest → oldest)
    )
  );

  setSortAsc(prev => !prev); // toggle each time you click
};

  
  const addUserSubmitHandler = (event) => {
    //Stop page resfresh(stop from submit)
    event.preventDefault();
    //Get form data
    const formData = new FormData(event.target);
    //Transform fromData to userData
    const { country, city, street, streetNumber, ...userData } = Object.fromEntries(formData);
    userData.address = {
      country,
      city,
      street,
      streetNumber,
    };

    userData.createdAt = new Date().toISOString();
    userData.updatedAt = new Date().toISOString();

    //TODO Fix address

    //TODO Fix createdAt and updatedAt
    //Create new user request
    fetch('http://localhost:3030/jsonstore/users', {
      method: 'Post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
      .then(() => {
        forceRefresh();
        closeUserModalHandler();
      })
      .catch(err => alert(err.message));

  };

  return (
    <div>
      <Header />

      <main className="main">
        <section className="card users-container">
          <Search />

          <UserList users={users} forceUserRefresh={forceRefresh} onSort={sortUsersHandler} />

          <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

          <Pagination />

        </section>

        {showCreateUser
          && <CreateUserModal
            onClose={closeUserModalHandler}
            onSubmit={addUserSubmitHandler}
          />}

      </main>

      <Footer />
    </div>
  );
}

export default App;
