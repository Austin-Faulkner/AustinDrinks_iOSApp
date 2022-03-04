//
//  ReviewFormViewControllerTableViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/20/22.
//

import UIKit

class ReviewFormViewController: UITableViewController {
    
    var selectedEstablishmentID: Int?
    
    @IBOutlet var ratingsView: RatingsView!
    @IBOutlet var titleTextField: UITextField!
    @IBOutlet var nameTextField: UITextField!
    @IBOutlet var reviewTextView: UITextView!   // UITextView; might need this for the Yelp reviews, if I plan to implement them at all which is unlikely
    @IBOutlet var yelpReviewsTextView: UITextView!  // see if we can add a UIView to contain all Yelp reviews.
    

    override func viewDidLoad() {
        super.viewDidLoad()
        print(selectedEstablishmentID as Any)
    }
}

private extension ReviewFormViewController {
    @IBAction func onSaveTapped(_ sender: Any) {
        var reviewItem = ReviewItem()
        reviewItem.rating = ratingsView.rating
        reviewItem.title = titleTextField.text
        reviewItem.name = nameTextField.text
        reviewItem.customerReview = reviewTextView.text
        if let selEstID = selectedEstablishmentID {
            reviewItem.establishmentID = Int64(selEstID)
        }
        CoreDataManager.shared.addReview(reviewItem)
        dismiss(animated: true, completion: nil)
    }
}
