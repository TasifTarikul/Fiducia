from django.test import TestCase
from .models import Order, User


class OrderModelTest(TestCase):

    def test_update_file_name(self):
        order = Order(id=23124, order_type="cybershop", package_image="imagename.jpg")
        self.assertEqual(
            order.update_filename("imagename.jpg"), "order_images/cybershop/23124imagename.jpg",
            "order filename not Equal")


class UserModelTest(TestCase):

    def test_profile_pic_folder(self):
        user = User(id=2, profile_pic="propic.jpg")
        self.assertEqual(user.profile_pic_folder("propic.jpg"), "user_profile_images/2/propic.jpg")