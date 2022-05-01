# The AustinDrinks iOS App

![Austin Drinks](https://user-images.githubusercontent.com/7588505/156605463-e936bf71-8883-49d5-b762-bcf514da86f5.png)

AustinDrinks provides a one-stop-shop for a local, adult-craft-beverage experience deep in the heart of Texas. The app helps users find and explore breweries, distilleries, and 
wineries in Austin and its surrounding areas. Austin and its surrounding areas offer a rich variety of options, and, whether you're a local or a visitor, the goal of AustinDrinks is to help one narrow 
down one's search for the perfect craft-beverage experience!

In short, this app is all about conveience, on-the-go, craft-beverage exploration and discovery. L'chaim! 

Copyright © Austin Faulkner. All rights reserved.

## State Chart for AustinDrinks

![STATE CHART for AustinDrinks](https://user-images.githubusercontent.com/7588505/161166086-4ae451dc-87a9-4dd6-a7a1-54a752df1c6d.png)

## UML Diagram Generated with the Help of Marco Eidenger's SwiftPlantUML

HOW TO READ: Read from left-to-right and from the topmost image to the bottommost image. For more information, see the paper "Outlining the UML Structures & the Crucial Algorithms for AustinDrinks", attached as a PDF below these diagrams.

![03_1 AD UML](https://user-images.githubusercontent.com/7588505/161167281-d1ee06d4-c363-4165-9187-21a54accacd5.png)
![02_1 AD UML](https://user-images.githubusercontent.com/7588505/161167378-a478277a-ecfa-4b69-8965-c77e131f756d.png)
![02_2 AD UML](https://user-images.githubusercontent.com/7588505/161167449-7c4f70a2-f23f-4130-b917-3516ff35df61.png)
![01_1 AD UML](https://user-images.githubusercontent.com/7588505/161167648-65e4c6a4-e136-4211-b0bb-8a2438baad6a.png)
![01_2 AD UML](https://user-images.githubusercontent.com/7588505/161167684-ff75eb86-b14b-495e-8428-335b7ccf5fd6.png)
![01_3 AD UML](https://user-images.githubusercontent.com/7588505/161167700-6043fc7a-10c7-425a-9caf-21b56523f709.png)

[Outlining the UML Structures & the Crucial Algorithms for AustinDrinks.pdf](https://github.com/Austin-Faulkner/AustinDrinks_iOSApp/files/8599798/Outlining.the.UML.Structures.the.Crucial.Algorithms.for.AustinDrinks.pdf)

# Acceptance Test Cases

1. THE EXPLORE HOME SCREEN: The app opens on the AustinDrinks logo screen, leading to the main screen which is the Explore screen (with the paper airplane icon highlighted at the bottom of the screen just above "Explore"). Now, one may choose one of two separate paths. On may choose to go through the MAP PATH by touching the map pin icon above "Maps" at the bottom of the screen, or one may choose to first select a city among 11 in the Austin and surrounding areas and continue to search establishments based upon a craft-beverage type selection. More on this below in the EXPLORE PATH section.

2. MAP PATH: Having chosen the map pin just above "Maps" at the bottom of the Explore home screen, one is taken to a map of Austin and its surrounding areas, where one sees pins for each of the craft-beverage establishments throughout the area. Any one pin may be a brewery, distillery, winery, or some amalgam of the three. The user may then touch a pin in a chosen area, and an establishment name will pop up over the touched pin. The user may then tap the pop-up establishment name, and the Map screen will re-direct to the establishments detail page on which is all the information one might need in order to more fully explore the chosen establishment. Such ESTABLISHMENT DETAILS include establishment name, craft-beverage type, phone number, hours of operation, pricing (if the information is available), address, website (more on this in 6.), and customer reviews (with a five-star rating system), if any. Further, one may find customer experience photos if any have been posted to the app.

3. EXPLORE PATH: Either staying on the Explore home screen or having touched the paper airplane icon at the bottom of the screen at some point along the MAP PATH, one observes that there are several craft-beverage types available for selection. Namely, there are "Beer", "Spirits", and "Wine", each representing breweries, distilleries, and wineries, respectively. One also observes that there is a blue "+LOCATION" button at the top of the Explore home screen. One must select a location from among the 11 Austin and surrounding areas before then selecting a craft-beverage type. If one does not first select a location, a flag will pop up indicating that the user must first select a location. Having selected a location, one is then allowed to select for exploration the craft-beverage type of choice. Say, you select "Spirits" in order to explore distilleries in the selected location "Austin". Then the user will be re-directed to distilleries listing view complete will all the distilleries in the Austin area. On this page (or in this View, if you're thinking about it from the programmer's perspective), one finds multiple rounded panes providing information on the distillery's name, craft-beverage type, accommodations--that is, Accepts Apple Pay, Dog friendly, etc.--a Yelp review rating, and the number of ratings on Yelp pertaining to this establishment. Suppose the user chooses "Still Austin Whiskey" due to some desired set of accommodations and ratings qualities. Then the user is re-directed to the ESTABLISHMENT DETAIL View (see 2. for more on this page's contents). On this View/page, the user may provide a review or a photo of his or her experience at Still Austin Whiskey, or both. Let's say the user enjoys Still Austin Whiskey and wants to do both. Say the user first wants to provide a review and then a photo or photos to the app.
  
4. THE REVIEW PATH: The user then selects the teal pencil button above the "Reviews" indicator and is then taken to a reviews View. There a user may write the Title of the review, the user's Name (or leave it blank), and the Review. The user then selects "Submit", or if unsatisfied the user may select "Cancel". If happy with the review, the Submit button posts to the review to Still Austin Whiskey's ESTABLISHMENT DETAIL page, using CoreData on the app.
  
5. THE PHOTO PATH: Wanting to then leave a photo or photos of the user's experience at Still Austin Whiskey, having returned to the ESTABLISHMENT DETAIL page after submitting her review, the user then selects the teal camera icon above the "Photo" indicator. The user is then taken to a screen where the user may select from the user's on-iPhone Photos or Albums. The user then selects the perfect photo for the post and then is re-directed to a filters View. There, the user may choose from among 5-7 filters the user might wish to apply the selected photo. Once happy with the photo depiction, the user may submit the photo to the Still Austin Whiskey ESTABLISHMENT DETAIL page by selecting “Save”. Alternatively, the user may select cancel. In either case, the user is re-directed to the ESTABLISHMENT DETAIL page. This process may be repeated as desired. Selecting from among the posted reviews or photos the user of AustinDrinks merely needs to swipe left or right to view all posted reviews or photos.

6. THE WEBSITE PATH: Once on the ESTABLISHMENT DETAIL page, either having arrived there by way of the EXPLORE PATH or the MAP PATH, the user may select the "Website" button. Selecting this button will re-direct the user to the craft-beverage establishment's website where the user may explore more about the establishment's drink offerings. So, if for example, the user is on Still Austin Whiskey's ESTABLISHMENT DETAIL page, upon touching the Website button, the user will be re-directed to Still Austin Whiskey's website, where the user may further explore what Still Austin Whiskey has in the way of drink offerings, its history, and whatever the site happens to deliver.

[Acceptance Test Cases.pdf](https://github.com/Austin-Faulkner/AustinDrinks_iOSApp/files/8429499/Acceptance.Test.Cases.pdf)

 # See "AustinDrinks Full Demo.mov" in the Repository
 The demo will provide a full demonstration of the various interactivity on the app. Note that the CoreData API allows the app to share all on-device Reviews and shared experience Photos with other app users. 
 
 
 
 
