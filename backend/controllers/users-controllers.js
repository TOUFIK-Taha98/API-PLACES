const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({users : users.map(user => user.toObject({ getters: true}))});
}

const getUserById = (req, res, next) => {
    const userId = req.params.id;
    const user = DUMMY_USERS.find(u => u.id === userId);

    if(!user){
        throw new HttpError("User doesn't exist!" , 404)
    }
    res.json(user)
}

const signup = async (req, res , next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(
            new HttpError("Invalid inputs passed, please check your data", 422)
        );
    }

    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email : email});
    } catch (err) {
        const error = new HttpError(
            'Sign up failed, please try again later.',
            500
        )
        return next(error);
    }
    if(existingUser){
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        )
        return next(error);
    }
    const createdUser = new User({
        name,
        email,
        image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAh1BMVEX///82NjY0NDQ4ODgVFRUxMTH8/PwhISEAAAAsLCwXFxcoKCgcHBwaGhoWFhYmJibx8fHk5OTKysq5ubkQEBCWlpbT09ONjY2qqqqwsLDc3Nzo6OhtbW3CwsJFRUU+Pj5bW1tRUVGhoaGIiIh8fHxmZmZ0dHReXl6AgICjo6OKiopLS0tUVFS/edbIAAAOHUlEQVR4nO1diXqiOhSGHBbZBFmsS12qY6u17/98NwFUwAQJiSXer//9pjN3RiW/Sc6Wc0407Q9/+MMf/vCHP/wK4qj6f1b56/8CC5OxRruo/peVny+PnMZqlG5n08lyGRH8T5hdEcX4x2lkhq5hjA0C3zbPhyxZDD0yaZhCFkeLNQK9AuTZqf8zm+SvsF59Vq39yA03eo0hAZhhup4Xgud1OUbJPycNAdMDVKenA5BptY3MemGhk2xT2ynmDlBjDkEvZhU84/RyFMvhnmzfvFuaNISweLWVSkTH1LPvtx4dCEa7oYfMC0vLRnijdaWog719pRkkOPpwv/WY/PB/Zrgcesxc2PkdJ6+C0SuZAJMRP0HQR5PXETbbbjK0SdEZetydsUj5CRKDwJ8PPfJOwAvt6PDPIIF5uHyC2rC0cT+CWDHm71edoaXNO6v6BsBcv8A6tbTI7q7p72BDpPIqzU3LSdiXXQ5zPTSLVhBztIcqrALUFqgW1vWgo8c8WoDU1oqW2BLNJ9GNh2bRhm9PnKH5OTSLFixHvYXolSCWp5q6Wj/zhBlijBV2MhwJBAH8ZGgeTCx6m2s1eOqGNLC5JgMKi5q3nj5FA2g7NBEmDqYEfthi+BiaCBOHPq79SzHEnq8MbaHwPjxJUYe6kw1NhIm5LWZ0FwBvNjQRJla+lDm01dX4U1ecHugQqOtcLA0pDA117dJIjtVmRI8fNRTk7EN/aBotEAxglPCGptGCDxkM0WZoGi34lGCYInRQ18WX4VwAco5D02jBTjwQpYPCRpumJTJcYFvlkHAciKsL8FdD02jBwhCPJoI7HZpGC5ap8BTqkKqclGG5EowalY02TZMQ1M9D3ooCq+m1+BQCUjrHTTzaBvqPwkf5u4+z+Byi84+yKn860rtmsrVzHKmqL06hFPdQ4YOLvZygvq6b/4amwgD2neRMovk+NBUG9jKODwmc/dBUGMhkrVJl/adEJBmqCmX9J0khb11X1n+aGJIkjTEZmgoNxM7yZTAElQOmaylHT7quaPKeJe0c33kbmgsTSY8ahCawOFb4dE3G2ZPiYQwJIW9AShclHMXtNgSmyjHvVSBhDpXV9wSR+EYESFUNYeSQEKdBX0OTaIUE01Th3MscurDhFg5N4QEmI1vk/Cn0RlN1Y6WF9R3N+h+xQTjfLRQ+AL4GcvtLmzygrzDBoi+L1T8JU3ExesM87ClvvNPQQ++ISU+9D4aqse479LVOVVcUN/T0hBXODW5iOu41iUqb3A3Yvc6g3KGHzYE3fpUIZJGqrArr6FOQr6tdd9jEpscyNYceNBd6VEC9jLov4QPvJKZKp9HcI/M4LTel4080RCkPQTzhI4WDpHRwHeoDIvbM6+gKregdwUMQ3JebQqwwOBjiX0MPtwc4zBrQQd0jQzZ44oqgj19MV2BELocwBUUPtlsx4aiBIvVqL+PeXxG7HFYN6ApX5LGw8oHjVF/lc18WEj4vOFS3MpYFnqpnvA8Vzk5gYc+jD0HddEQ23vkYKtxlgAWeUkQidc9DD5gba47DC9LKVeUEDDp4G0j4L+Y98dcHua9mmHJnZajcHIoKUqfHNYtK1+TREPOuUn/1Yvtw5XPG2rBh+loM5yGnLPV2L8ZwxZsRrWx+/h0sbUqOASOesxlyiUAeL41XJNVB4bnMx7YrOo9nXEXPEOzJl7McqVotUwIzjD5skuKLqWYcswjGm5bfcuF7oHjAZp6aV/tr3rmwG9Jd+R5AKFW1NI8g+gqqNvSqU69P/I7RNYRBalDt81JVsTrDE4iq1RJdegoTgvHV6v4yEQBKlazsWuzMsrCr8GXzbbUMHnqJoKeLW2nzu5lfGeF5mWJGXPztGJ5e3Ghx9dZJyXnkPHL1UbDUbo7T3ik/xQnsYzzoWr093Fp92kblKK0ecbE2rQlSYDq1DuXVXCPTDQ5JVD5tMLLL+dbwnZobUWVIxvXTchqMzE196NUiTbwjTTv9KG+9GoTj4rQ27DJYceUAtTkk++sQMq9j8X60enuBaguf/LokQF4K2SC+4/TNGXuo5FYlUMlOs4ofR5cR/g4PWmNuZrV+4JePdVLv+Pyov1UdNN56LmN/AaXUPDMoCxXAv3/ljN7xHHQzuG7K6nCewnI5/3F9k33sQiumn43wLNbfAbqR3fe/YDAsPthOz5er6J7Dj2Cx26Qhul0pRhsILYeSYt6kM8pQZ8z2L4U081L97YmaMt6HBhGM7cdmlPh8fmVCQ9ykCU0JtDQLgzw0jjel4f9bPWESl8kBq4U2Zi0MCSZpEdvOgfSKpVZFt5J+00+386oPIuBSFu+c7tap3dxILCDGGUuefnK5Ry9lyP+O2cVANuUmu8hXoesFF0n2HrqeTrnej/UFHxjfVbQxS4qmzbpqpXP+NBEETuAfskRoW0aZY9gXy7KrP8s6RcKb7sPL16kJudinLa1u9yjBVdKZjm2Eb72zjbLU6ZPNzDons4rOkWBu2WYmz5ncFU56tHhNV/Lypen1qgsxWxgeTLzY0Qd7LL0YYo7+QuPai4TgdIT0fo086O1HyWcePGJP6+aZOZp+DVCxiBiteKXNYpSz67NKEetrO9rld+bQhRFh2IdgQZHLcLVIRlNfwH1HueLLzW79CMJ/t7+u4dy770QRcO0+jV8C9bwB7SuztJN7Gz34jNQLgcYaCHgIrkRqsu/7HpIHr2pJw2DQ89aF6k95Lt0th9HnOYwkPGyXVgkiSKlnTQL9T0H3OaaQ5bJ2ehDtNJdybSdNNAjV84M96zaJRG0hgd55tA6rtHMaoNysOhHo8MqRsWJZbvMSba4nUUrQqD4RjO5eJ3j1QLrsOIXc57f1gVPSDOe0OQzuI9uxQIMbrGo7p/+9C10XQ03C2+HlV1n5xHD2KSUkc1usX0HHZWqJdn7Y3n+kllVXPiFo03oj/hNrq9G1d49Yy2o8VxSVrxGK1Vf5nzTvSfTuxLDbUflRsD8JjClOqZWHFK8vCY40wb7sU7ZYw7YTQ7Fux8BMq5jfxIhNPz5LBLehrrtdhOlUtOs4MPynyi5jfNUHQX4d+7lL6GCZUg9xJ7dT75Tq6lgG4q5abKBTLfFGuHEeQy9tKx8MtBesxNu9UVy3O4jvdp3eFnBa/WA/aYpSq3cIowJs9j8IvVncVQT0B6UU96LazBzR7pKxJLTR6tJkmZykCz+I8pzVuLLHIPcDGpBwOUanrpKhlJ7c97GaRt43ZcP8mLpglykSBXp478BUSpdV0oelEsDEf4ibOghPYn0jyrg5Qu/QXGPXL0haB+U2nLsQEzR3oow7ajCcR73AP7oewLQC9KA+QdP70u7mly2pkfSjsobI6BkGbj6nkS5KuwiqHhufyrmz7WETYhEXtAZ0rqbcUGJo0GiiIK4MSzxIxZXWdBxqJ4QWxdatXwIYyZEz+sNORRLuGClR6xxPaU4Lul81Tk+8XSbYaDXcJHTnzEHG6laWKc1fqfsBSBpBaN2I0rahXt8PMS0wcotYWVosS87cC7k6Mjk6qUDFS6QaZF7FDZZyG3QB1OpBSbgm5vakSmSYWjJbSS2SZM9cPrgl9B2IW92VB92SMr5pIrry71LXjm6wI27CAYwqqgqP3iuyjG5asu4vLYByEcaYxHlLVhkvAMFto33Q1gZcW1/NJfikFbTUhYsFuxsAopnKr5LWyaVy/dgGydwdxJ5iQSZBvXqCQY8SElfOyjeHzIfqrNsjrELfS+WISofbGtPSS0vVbMlUFQWY1Zpxv4aObFwakk6o5ZaXf5US+6qB2WSDndzZE1DmuC0MWhz0YrZRVYkQmJ3RDkiK+1tBGXSL6e32i3MUi2h7uY9liBpLk/qUHFB4GIwoWqFNThJV1OWx1NMvImhk7wcEkGv9E71kttBbHD1QOsOlp69OZVwiWgPoKI+cftPz+nOzTcbNLXfPZQTcpFxX3HxWHtymWhJQRGo42rp1fyrjWjP5Mo2ASO4vhsWCGqcZ0sDINf96wqP0/JiJMU8k7v0j01yrPZQC2ZZF+Sx3xTxVNqIFV4vM7qCeBcuK0dzhrLHygIxIWgyxDjSmxWqWIztPx++ak98ZbsxqSOvHYjlQTQA5tyM6KqTd1Wpp1swMTNnmBTHdyLETXV2s5U4hFAWorr1jHkDFByOUPYVti0L6s0hl1JaZD51vzmi2SeVqjRYSLfVh/WCm5i56XFS72Nt4tYpmRfwuSEDZ9IN/nQto4k/DL05kX4BnUTzjG4eOFw9cqqRW74Sk1PjJ02Da6VfCVU9SZoKs3oPgKZacVJiBe+Ch10B89IjgEc0ZfA7w8nRc+1Ok3DJ/6zTbpGVNugrSpxwCqSe1DV1Wc4ll8u6PHeGkM3kA8ILx13xynQYRXD5gulu7SuxKIHKzrB+1pFC8IYrfNkbgVMNVvzOrUKgt0lbE8VM4rp7ZgRCzPKeud6krfYLZ1WR3fQJyAmOzfx47S7v1VZjuvuyx7ei/MYdAgEzb8LdZ/EvdIwuek+RtbRv28+WPY4+D9T5ZNL/n38Ei+f4IjSA0C3VZWkDclMseBuWaz1sL5BXRnp/a530yHbpr1DI+fa791LdNsxhuk2M3xkXJSSFSHM83/M37Llap5ecknu23Zmr4NhZDwG0c5K9HpmMHhuH87E/xZOiJq+Hmj1mTeL77POMpwFRDh6zeB1yB8PJsPzACb/2ezePJvThRiuwFy+kqOX2/f2D17I4NNwgw4TD0nBz4T5hS4Bou9l/gfNjvktW0U92ZmrCixTSOV8l8Ntu9fb+9vWWz2TxJ4ng6Wb5a82AqHk+NVfvtJWA9HnUjlKJyR88//OEPf3iI/wADk8pc5IoJagAAAABJRU5ErkJggg==',
        password,
        places: []
    })
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Sigin up failed, please try again',
            500
        )
        return next(error);
    }
    res.status(201).json({user : createdUser.toObject({ getters: true})});
}

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email : email});
    } catch (err) {
        const error = new HttpError(
            'Logging failed, please try again later.',
            500
        )
        return next(error);
    }
    if(!existingUser || existingUser.password != password){
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            500
        )
        return next(error);
    }
    res.json({message : "Logged in!"})
}
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;