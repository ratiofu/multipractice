import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import './main.html'

function random() {
  return Math.round(Math.random() * 12)
}

Template.practice.onCreated(function () {
  this.a = new ReactiveVar(random())
  this.b = new ReactiveVar(random())
  this.state = new ReactiveVar('')
  this.isAsking = new ReactiveVar(true)
  this.canAnswer = new ReactiveVar(false)
  this.expected = new ReactiveVar(null)
})

Template.practice.onRendered(function () {
  Template.instance().inputField = $('input').focus()
})

Template.practice.helpers({
  factorA() {
    return Template.instance().a.get()
  },
  factorB() {
    return Template.instance().b.get()
  },
  canAnswer() {
    return Template.instance().canAnswer.get()
  },
  state() {
    return Template.instance().state.get()
  },
  isAsking() {
    return Template.instance().isAsking.get()
  },
  expected() {
    return Template.instance().expected.get()
  },
  hasExpected() {
    const expected = Template.instance().expected.get()
    return expected || expected === 0
  }
})

function checkAnswer(instance) {
  const a = instance.a.get(), b = instance.b.get(),
        expected = a * b,
        answer = instance.inputField.val(),
        correct = parseInt(answer) === expected
  instance.state.set(correct ? 'Correct' : 'Incorrect')
  instance.isAsking.set(false)
  if (!correct) {
    instance.expected.set(expected)
  }
}

function newProblem(instance) {
  instance.state.set()
  instance.a.set(random())
  instance.b.set(random())
  instance.inputField.val('')
  instance.isAsking.set(true)
  instance.canAnswer.set(false)
  instance.expected.set(null)
  instance.inputField.focus()
}

Template.practice.events({
  'click #checkAnswer'(event, instance) {
    checkAnswer(instance)
    return false
  },
  'click #newProblem'(event, instance) {
    newProblem(instance)
    return false
  },
  'change input, keyup input, click input'(event, instance) {
    instance.canAnswer.set(!!Template.instance().inputField.val())
    if (event.keyCode === 13) {
      if (!instance.isAsking.get()) {
        newProblem(instance)
      } else if (instance.canAnswer.get()) {
        checkAnswer(instance)
      }
    }
    return false
  }
})
