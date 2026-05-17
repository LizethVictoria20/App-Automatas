# Turing Machine Exercises

This file collects the Turing machine exercise specifications provided by the user.

## 1. Language: a^i b^j c^k where i*j = k

Description: Accepts strings of the form a^i b^j c^k with i,j,k >= 1 and i*j = k.

input: aabbbcccccc
blank: ' '
start state: start

table:
  start:  {        a: {R: a+}}
  a+:     {a: R,   b: {R: b+}}
  b+:     {b: R,   c: {R: c+}}
  c+:     {c: R, ' ': {L: left}}
  left:
    [a,b,c]: L
    ' ': {R: eachA}

  eachA:
    a: {write: ' ', R: eachB}
    b: {R: scan}
  eachB:
    a: R
    b: {write: B, R: markC}
    C: {L: nextA}
  markC:
    [b,C]: R
    c: {write: C, L: nextB}
  nextB:
    [b,C]: L
    B: {R: eachB}
  nextA:
    a: L
    B: {write: b, L}
    ' ': {R: eachA}

  scan:
    [b,C]: R
    ' ': {R: accept}
  accept:

## 2. Binary Addition (adder)

Description: Adds two binary numbers separated by `+` and leaves the sum on the tape.

input: '1011+11001'
blank: ' '
start state: right

table:
  right:
    [0,1,+]: R
    ' ': {L: read}

  read:
    0: {write: c, L: have0}
    1: {write: c, L: have1}
    +: {write: ' ', L: rewrite}
  have0: {[0,1]: L, +: {L: add0}}
  have1: {[0,1]: L, +: {L: add1}}
  add0:
    [0,' ']: {write: O, R: back0}
    1      : {write: I, R: back0}
    [O,I]  : L
  add1:
    [0,' ']: {write: I, R: back1}
    1      : {write: O, L: carry}
    [O,I]  : L
  carry:
    [0,' ']: {write: 1, R: back1}
    1      : {write: 0, L}
  back0:
    [0,1,O,I,+]: R
    c: {write: 0, L: read}
  back1:
    [0,1,O,I,+]: R
    c: {write: 1, L: read}

  rewrite:
    O: {write: 0, L}
    I: {write: 1, L}
    [0,1]: L
    ' ': {R: done}
  done:

## 3. Fibonacci sequence (exercise prompt)

Description: Generate Fibonacci sequence in binary (right-to-left listing). Uses the adder as a subroutine.

Prompt/hint: Prefix the current number with a `+`, copy the previous number and place it left of the `+`, run the adder, and repeat.

## 4. Unary Multiplication

Description: Multiplies two unary numbers (tallies) separated by `*`.

input: '||*|||'  # try '*', '|*|||', '||||*||'
blank: ' '
start state: eachA

table:
  eachA:
    '|': {write: ' ', R: toB}
    '*': {R: skip}
  toB:
    '|': R
    '*': {R: eachB}
  nextA:
    ' ': {write: '|', R: eachA}
    ['|','*']: L

  skip:
    '|': R
    ' ': {R: done}
  done:

  eachB:
    ' ': {L: nextA}
    '|': {write: ' ', R: sep}
  sep:
    ' ': {R: add}
    '|': R
  add:
    ' ': {write: '|', L: sepL}
    '|': R
  sepL:
    ' ': {L: nextB}
    '|': L
  nextB:
    ' ': {write: '|', R: eachB}
    '|': L

## 5. Binary Multiplication

Description: Multiplies two binary numbers separated by `*` using repeated doubling and adding.

input: '11*101'
blank: ' '
start state: start

table:
  start:
    [0,1]: {L: init}
  init:
    ' ': {write: '+', R: right}
  right:
    [0,1,'*']: R
    ' ': {L: readB}

  readB:
    0: {write: ' ', L: doubleL}
    1: {write: ' ', L: addA}
  addA:
    [0,1]: L
    '*': {L: read}
  doubleL:
    [0,1]: L
    '*': {write: 0, R: shift}
  double:
    [0,1,+]: R
    '*': {write: 0, R: shift}
  shift:
    0: {write: '*', R: shift0}
    1: {write: '*', R: shift1}
    ' ': {L: tidy}
  shift0:
    0:   {R: shift0}
    1:   {write: 0, R: shift1}
    ' ': {write: 0, R: right}
  shift1:
    0:   {write: 1, R: shift0}
    1:   {R: shift1}
    ' ': {write: 1, R: right}

  tidy:
    [0,1]: {write: ' ', L}
    +: {write: ' ', L: done}
  done:

  # adder submachine (keeps '+' and continues to 'double')
  read:
    0: {write: c, L: have0}
    1: {write: c, L: have1}
    +: {L: rewrite}
  have0: {[0,1]: L, +: {L: add0}}
  have1: {[0,1]: L, +: {L: add1}}
  add0:
    [0,' ']: {write: O, R: back0}
    1      : {write: I, R: back0}
    [O,I]  : L
  add1:
    [0,' ']: {write: I, R: back1}
    1      : {write: O, L: carry}
    [O,I]  : L
  carry:
    [0,' ']: {write: 1, R: back1}
    1      : {write: 0, L}
  back0:
    [0,1,O,I,+]: R
    c: {write: 0, L: read}
  back1:
    [0,1,O,I,+]: R
    c: {write: 1, L: read}
  rewrite:
    O: {write: 0, L}
    I: {write: 1, L}
    [0,1]: L
    ' ': {R: double}

---

## Archivos individuales
He agregado cada ejercicio como archivo separado en la carpeta `exercises/`:

- [a^i b^j c^k (producto)](exercises/abc_product.md)
- [Suma binaria](exercises/binary_addition.md)
- [Fibonacci (prompt)](exercises/fibonacci_prompt.md)
- [Multiplicación unaria](exercises/unary_multiplication.md)
- [Multiplicación binaria](exercises/binary_multiplication.md)

- [Multiplied Lengths](exercises/multiplied_lengths.md)
- [Suma binaria](exercises/binary_addition.md)
- [Multiplicación unaria](exercises/unary_multiplication.md)
- [Multiplicación binaria](exercises/binary_multiplication.md)

