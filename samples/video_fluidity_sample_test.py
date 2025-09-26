import logging
from typing import Any, Dict, Optional, Union
"""Import more if needed."""
import time
 
supportAppiumOptions: bool = True
try:
    from appium.webdriver.webdriver import AppiumOptions
except ImportError:
    supportAppiumOptions = False
 
 
from appium import webdriver
 
# For W3C actions.
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.actions import interaction
from selenium.webdriver.common.actions.action_builder import ActionBuilder
from selenium.webdriver.common.actions.pointer_input import PointerInput
 
appium_url: str = "http://127.0.0.1"
options: Optional[Union[Dict[str, Any], AppiumOptions]] = None
logger = logging.getLogger(__name__)


# Please do not change the name of the class.
class TestRunner:
    def __init__(self, device_serial_number: str, port: int):
        self.__driver: Optional[webdriver.webdriver.WebDriver] = None
        _capabilities: Dict[str, Any] = {
            "platformName": "Kepler",
            "appium:automationName": "automation-toolkit/JSON-RPC",
            "kepler:device": f"vda://{device_serial_number}",
            "kepler:jsonRPCPort": 8383,
            "newCommandTimeout": 500,
            "appium:deviceName": device_serial_number,
        }
        self.appium_url = f"{appium_url}:{port}"

        if supportAppiumOptions:
            self.__driver = webdriver.Remote(
                self.appium_url, 
                options=AppiumOptions().load_capabilities(_capabilities)
            )
        else:
            self.__driver = webdriver.Remote(self.appium_url, _capabilities)

    def prep(self) -> None:
        """ Preparation step to navigate to path to the 
        video streaming carousel.

        In this preparation step, Appium selects the thumbail of 
        "Tears of Steel" in lower middle area of the KeplerVideoApp.

        The code will wait for 10 seconds for the app to warm up
        and then hit the "Play Movie" button to start streaming
        video.

        Fluidity of the video streaming is not measured during prep
        stage.
        """
        # wait 10 seconds for app to warm up
        logger.info("Waiting for application to warm up for 10 seconds")
        time.sleep(10)

        actions = ActionChains(self.__driver)
        actions.w3c_actions = ActionBuilder(self.__driver, mouse=PointerInput(interaction.POINTER_TOUCH, "touch"))
        actions.w3c_actions.pointer_action.move_to_location(1065, 921)
        actions.w3c_actions.pointer_action.pointer_down()
        actions.w3c_actions.pointer_action.pause(0.1)
        actions.w3c_actions.pointer_action.release()
        actions.perform()
        
        # Wait 10 seconds for app's video streaming carousel to warm up.
        time.sleep(10)

        actions = ActionChains(self.__driver)
        actions.w3c_actions = ActionBuilder(self.__driver, mouse=PointerInput(interaction.POINTER_TOUCH, "touch"))
        actions.w3c_actions.pointer_action.move_to_location(301, 288)
        actions.w3c_actions.pointer_action.pointer_down()
        actions.w3c_actions.pointer_action.pause(0.1)
        actions.w3c_actions.pointer_action.release()
        actions.perform()

 
    def run(self) -> None:
        """ KPI Visualizer's Video Fluidity Test will measure the
        video streaming fluidity while perfoming actions in
        run stage.

        To measure the video streaming fluidity for 1 minute, run
        stage will simply wait for 1 minute without actions so that
        the video streamed in prep stage can play for 1 minute.
        """
        # Wait 1 minute to mesaure video streaming fluidity
        # of "Tears of Steel" video in KeplerVideoApp.
        time.sleep(60)        
