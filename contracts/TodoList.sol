// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
    STEPS

    1. Implement todo list contract                         Done
    2. Implement tests for todo list contract               
    3. Deploy contract and create frontend template
    4. Implement connect wallet functionality
    5. Inject web3 obj / ethersjs
    6. Implement creation and display of tasks
    7. Implement marking tasks complete
    8. Update readme

*/

contract TodoList {
    uint public taskCount = 0; // used to id each task

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    // public vars
    Task[] public tasks;
    mapping (address => uint) public userToTaskCount;
    mapping (uint => address) public idToUser;

    // creates task specific to user
    // adds task to UI accordingly
    function createTask(string memory _content) public {
        require(bytes(_content).length <= 140); // set char limit to 140
        tasks.push(Task(taskCount, _content, false));
        idToUser[taskCount] = msg.sender;
        userToTaskCount[msg.sender]++;
        taskCount++;
    }

    // mark task with id id complete
    // removes task from UI accordingly
    function markTaskComplete(uint id) public {
        require(idToUser[id] == msg.sender);
        tasks[id].completed = true;
    }

    // for front end purposes
    // gives client array of all ids in order to display tasks on UI
    function getTasksByOwner(address owner) public view returns (uint[] memory) {
        uint[] memory result = new uint[](userToTaskCount[owner]);
        uint resultIndex = 0;

        uint id = 0;
        while (id < tasks.length && resultIndex < userToTaskCount[owner]) {
            if (idToUser[id] == owner) {
                result[resultIndex] = id;
                resultIndex++;
            }
            id++;
        }

        return result;
    }
}