const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
    let contract;
    let owner;

    beforeEach(async function () {
        const TodoList = await ethers.getContractFactory("TodoList");
        const todoList = await TodoList.deploy();
        contract = await todoList.deployed();
        [alice, bob, carol] = await ethers.getSigners();
    })

    it("Should create a new task properly and update task counts and mappings", async function () {
        expect(await contract.taskCount()).to.equal(0); // taskCount should == 0
        await contract.createTask("task 1");
        let task = await contract.tasks(0);
        // expect task to have proper fields and task counts to be correct
        expect(task.id).to.equal(0);
        expect(task.content).to.equal("task 1");
        expect(task.completed).to.equal(false);
        expect(await contract.taskCount()).to.equal(1);
        expect(await contract.userToTaskCount(alice.address)).to.equal(1); 
        expect(await contract.idToUser(0)).to.equal(alice.address);
    });

    it("Should toggle task complete", async function () {
        await contract.createTask("task 1");
        await contract.markTaskComplete(0);
        let task = await contract.tasks(0);
        expect(task.completed).to.equal(true);
    });

    it("Should create tasks specific to different users", async function () {
        await contract.createTask("task 1");
        await contract.connect(bob).createTask("task 2");
        await contract.createTask("task 3");
        await contract.connect(bob).createTask("task 4");
        expect(await contract.idToUser(0)).to.equal(alice.address);
        expect(await contract.idToUser(1)).to.equal(bob.address);
        expect(await contract.idToUser(2)).to.equal(alice.address);
        expect(await contract.idToUser(3)).to.equal(bob.address);
    });

    it("Should get all the tasks owned by a specific user", async function () {
        await contract.createTask("task 1");
        await contract.connect(bob).createTask("task 2");
        await contract.createTask("task 3");
        await contract.connect(bob).createTask("task 4");
        await contract.connect(carol).createTask("task 5");
        await contract.connect(carol).createTask("task 6");

        let aliceTasks = await contract.getTasksByOwner(alice.address);
        let bobTasks = await contract.getTasksByOwner(bob.address);
        let carolTasks = await contract.getTasksByOwner(carol.address);

        for (let i = 0; i < 2; i++) {
            let aliceTask = aliceTasks[i];
            let bobTask = bobTasks[i];
            let carolTask = carolTasks[i];
            expect(await contract.idToUser(aliceTask)).to.equal(alice.address);
            expect(await contract.idToUser(bobTask)).to.equal(bob.address);
            expect(await contract.idToUser(carolTask)).to.equal(carol.address);
        }
    });
});