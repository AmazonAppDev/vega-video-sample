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
    _PRESS_DELAY: float = 0.9

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

    # You may also define helper function to modularize
    # functions called within the test scenario.
    def _press_dpad(self, direction: str, interval: float):
        """Helper function to send D-pad key press event to Kepler device.
        
        Args:
            Direction (str): D-pad direction key. Please refer to 
                https://developer.amazon.com/docs/kepler-tv/appium.html#use-appium-on-kepler-simulator
                for D-pad direction keys.
            interval (int): The time interval between each movement along the path, in unit seconds.
                _press_dpad will wait for time difference between the interval and time lapse of
                press event.
        """
        # We keep "holdDuration" to 0 (no holding) to
        # reproduce D-pad clicking behavior by app users.
        start: float = time.time()
        self.__driver.execute_script(
                "jsonrpc: injectInputKeyEvent",
                [{"inputKeyEvent": direction , "holdDuration": 0}]
            )
        cmd_time: float = time.time() - start
        if interval > cmd_time:
            wait_time: float = interval - cmd_time
            logger.info(f"Sleeping for {wait_time} seconds to give {interval} seconds interval between D-pad press events.")
            time.sleep(wait_time)
 
    def prep(self) -> None:
        """ Code for preparation stage.

        For D-pad key send test case, we do not define preparation step
        as the D-pad key are sent to Home page of the KeplerVideoApp.
        """
        # wait 10 seconds for app to warm up
        logger.info("Waiting for application to warm up for 10 seconds")
        time.sleep(10)
        return
 
    def run(self) -> None:
        """ Code to send D-Pad keys.

        KPI (e.g. UI Fluidity/Backgroud memory) will be measured during
        run stage code run.

        For D-Pad key send sample test, following interactions will
        be performed:
            1. Send "Down" key for 5 times
            2. Send "Up" key for 4 times
            3. Send "Right" key for 4 times
            4. Send "Left" key for 4 time.
        """
        for _ in range(5):
            # Give 900 ms (_PRESS_DELAY) interval between consecutive D-Pad press actions
            # to mimic human behavior.
            self._press_dpad("108", TestRunner._PRESS_DELAY)

        for _ in range(4):
            self._press_dpad("103", TestRunner._PRESS_DELAY)
            
        for _ in range(4):
            self._press_dpad("106", TestRunner._PRESS_DELAY)
            
        for _ in range(4):
            self._press_dpad("105", TestRunner._PRESS_DELAY)
        
