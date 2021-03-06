const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, Image, Review } = require('../../db/models');

const router = express.Router();

const verifyImageOwner = async (req, res, next) => {
    const image = await Image.findByPk(req.params.id);
    if (image.spotId) {
        const spot = await Spot.findByPk(image.spotId);
        if (req.user.id != spot.ownerId) {
            const err = new Error('Forbidden');
            err.status = 403;
            err.title = "Forbidden";
            err.message = "Forbidden";
            next(err);
        }
    } else if (image.reviewId) {
        const review = await Review.findByPk(image.reviewId);
        if (req.user.id != review.userId) {
            const err = new Error('Forbidden');
            err.status = 403;
            err.title = "Forbidden";
            err.message = "Forbidden";
            next(err);
        }
    }
    next();
};

const verifyImageId = async (req, res, next) => {
    const image = await Image.findByPk(req.params.id);
    if (!image) {
        const err = new Error('Image couldn\'t be found');
        err.status = 404;
        err.message = 'Image couldn\'t be found';
        err.title = 'Image couldn\'t be found';
        next(err);
    }
    next();
};

router.delete('/:id', requireAuth, verifyImageId, verifyImageOwner, async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.id);
        await image.destroy();
        return res.json({
            message: "Successfully deleted",
            statusCode: res.statusCode,
        })
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res) => {
    const images = await Image.findAll();
    return res.json(images)
})

module.exports = router;
