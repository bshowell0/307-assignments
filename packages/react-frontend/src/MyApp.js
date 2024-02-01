import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
    const [characters, setCharacters] = useState([]);

    // function removeOneCharacter(index) {
    //     const updated = characters.filter((character, i) => {
    //         return i !== index;
    //     });
    //     setCharacters(updated);
    // }

    function removeOneCharacter(id) {
        console.log("removing: ", id);
        deleteUser(id)
            .then((response) => {
                if (response.status === 204) {
                    const updated = characters.filter((character) => {
                        return character.id !== id;
                    });
                    setCharacters(updated);
                } else {
                    console.log('User was not deleted. Status code: ', response.status);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function deleteUser(id) {
        return fetch(`http://localhost:8000/users/${id}`, {
            method: 'DELETE',
        });
    }

    function updateList(person) {
        postUser(person)
            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error("User was not added. Status code: " + response.status);
                }
            }).then((person) => {
                setCharacters([...characters, person]);
            }).catch((error) => {
                console.log(error);
            })
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, []);

    return (
        <div className="container">
            <Table
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;