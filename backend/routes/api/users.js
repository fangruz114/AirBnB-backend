const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Image, Booking, sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

router.get('/:id/bookings', requireAuth, async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.params.id },
            attributes: [
                'id',
                'spotId',
                'userId',
                [sequelize.fn('strftime', sequelize.col('stDate')), 'startDate'],
                [sequelize.fn('strftime', sequelize.col('edDate')), 'endDate'],
                'createdAt',
                'updatedAt'
            ],
            include: [{
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    'previewImage']
            }]
        });
        return res.json({ Bookings: bookings })
    } catch (err) {
        next(err);
    }
});

router.get('/:id/reviews', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: { userId: req.params.id },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        }, {
            model: Image,
            attributes: ['url']
        }]
    });
    res.json({ Reviews: reviews });
});

router.get('/:userId/spots', requireAuth, async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = "Forbidden";
        err.message = "Forbidden";
        next(err);
    }

    const spots = await Spot.findAll({
        where: { ownerId: req.params.userId }
    });
    return res.json({ Spots: spots });
});

router.post('/', validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    await setTokenCookie(res, user);

    return res.json({ user });
});


module.exports = router;
